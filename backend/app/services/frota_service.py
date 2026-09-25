from decimal import Decimal
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text, desc
from backend.app.schemas.veiculo import VeiculoKPISummary, VeiculoRead, PaginatedVeiculos

class FrotaService:

    @staticmethod
    def get_kpis(db: Session) -> VeiculoKPISummary:
        """Calcula os 4 KPIs executivos da Torre de Controle em tempo real."""
        # 1. Totais da frota
        query_totais = text("""
            SELECT 
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status_operacional = 'EM_USO') AS em_uso,
                COUNT(*) FILTER (WHERE status_operacional = 'DISPONIVEL') AS disponiveis,
                COUNT(*) FILTER (WHERE status_operacional = 'MANUTENCAO') AS manutencao,
                COUNT(*) FILTER (WHERE status_operacional = 'SINISTRADO') AS sinistrados
            FROM tb_frota_veiculos;
        """)
        r_totais = db.execute(query_totais).fetchone()
        total = r_totais.total or 0
        em_uso = r_totais.em_uso or 0
        disponiveis = r_totais.disponiveis or 0
        manutencao = r_totais.manutencao or 0
        sinistrados = r_totais.sinistrados or 0
        taxa = round((em_uso / total * 100), 1) if total > 0 else 0.0

        # 2. Revisões urgentes ou vencidas
        query_rev = text("""
            SELECT COUNT(*) 
            FROM vw_frota_alertas_manutencao 
            WHERE status_alerta_revisao IN ('REVISAO_VENCIDA', 'ALERTA_CRITICO');
        """)
        revisoes_urgentes = db.execute(query_rev).scalar() or 0

        # 3. Multas pendentes de indicação
        query_multas = text("""
            SELECT COUNT(*) 
            FROM tb_frota_multas 
            WHERE condutor_indicado = FALSE;
        """)
        multas_pendentes = db.execute(query_multas).scalar() or 0

        # 4. Alertas de auditoria: veículos sob posse de técnicos inativos
        query_inativos = text("""
            SELECT COUNT(*) 
            FROM vw_frota_alerta_condutor_inativo;
        """)
        alertas_inativos = db.execute(query_inativos).scalar() or 0

        return VeiculoKPISummary(
            total_veiculos=total,
            em_uso=em_uso,
            disponiveis=disponiveis,
            em_manutencao=manutencao,
            sinistrados=sinistrados,
            taxa_utilizacao_percent=taxa,
            revisoes_urgentes_ou_vencidas=revisoes_urgentes,
            multas_pendentes_indicacao=multas_pendentes,
            veiculos_condutor_inativo=alertas_inativos
        )

    @staticmethod
    def list_veiculos(
        db: Session,
        status: Optional[str] = None,
        base_id: Optional[int] = None,
        busca: Optional[str] = None,
        page: int = 1,
        page_size: int = 50
    ) -> PaginatedVeiculos:
        """Lista veículos a partir da view consolidada vw_frota_painel_geral com filtros."""
        where_clauses = []
        params: Dict[str, Any] = {}

        if status and status.upper() != "TODOS":
            where_clauses.append("status_operacional = :status")
            params["status"] = status.upper()

        if base_id:
            where_clauses.append("id_base = :base_id")
            params["base_id"] = base_id

        if busca:
            where_clauses.append("(placa ILIKE :busca OR modelo ILIKE :busca OR condutor_atual_nome ILIKE :busca)")
            params["busca"] = f"%{busca}%"

        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        # Contagem total
        count_sql = text(f"SELECT COUNT(*) FROM vw_frota_painel_geral {where_sql};")
        total = db.execute(count_sql, params).scalar() or 0

        # Paginação
        offset = (page - 1) * page_size
        params["limit"] = page_size
        params["offset"] = offset

        data_sql = text(f"""
            SELECT 
                id_veiculo, placa, modelo, marca, ano, status_operacional,
                hodometro_atual, franquia_mensal_km, franquia_final_km, custo_locacao_mensal,
                data_inicio_contrato, data_fim_contrato, dias_para_fim_contrato, status_vigencia_contrato,
                locadora_nome, base_nome, base_uf, base_codigo_atp,
                condutor_atual_id, condutor_atual_nome, condutor_atual_matricula
            FROM vw_frota_painel_geral
            {where_sql}
            ORDER BY placa ASC
            LIMIT :limit OFFSET :offset;
        """)

        rows = db.execute(data_sql, params).fetchall()
        items = [
            VeiculoRead(
                id_veiculo=r.id_veiculo,
                placa=r.placa,
                modelo=r.modelo,
                marca=r.marca,
                ano=r.ano,
                status_operacional=r.status_operacional,
                hodometro_atual=r.hodometro_atual,
                franquia_mensal_km=r.franquia_mensal_km,
                franquia_final_km=r.franquia_final_km,
                custo_locacao_mensal=r.custo_locacao_mensal,
                data_inicio_contrato=r.data_inicio_contrato,
                data_fim_contrato=r.data_fim_contrato,
                dias_para_fim_contrato=r.dias_para_fim_contrato,
                status_vigencia_contrato=r.status_vigencia_contrato,
                locadora_nome=r.locadora_nome,
                base_nome=r.base_nome,
                base_uf=r.base_uf,
                base_codigo_atp=r.base_codigo_atp,
                condutor_atual_id=r.condutor_atual_id,
                condutor_atual_nome=r.condutor_atual_nome,
                condutor_atual_matricula=r.condutor_atual_matricula
            )
            for r in rows
        ]

        return PaginatedVeiculos(
            total=total,
            page=page,
            page_size=page_size,
            items=items
        )

    @staticmethod
    def get_veiculo_por_placa(db: Session, placa: str) -> Optional[Dict[str, Any]]:
        """Retorna ficha completa de um veículo: dados, condutor, revisões e multas."""
        placa_clean = placa.strip().upper().replace("-", "")
        veic_sql = text("SELECT * FROM vw_frota_painel_geral WHERE placa = :placa;")
        v = db.execute(veic_sql, {"placa": placa_clean}).fetchone()
        if not v:
            return None

        # Histórico de revisões
        rev_sql = text("""
            SELECT id_manutencao, ciclo_km, odometro_momento, proxima_revisao_km, data_realizacao, status, notas
            FROM tb_frota_manutencoes
            WHERE id_veiculo = :id_veiculo
            ORDER BY created_at DESC;
        """)
        revisoes = [dict(r._mapping) for r in db.execute(rev_sql, {"id_veiculo": v.id_veiculo}).fetchall()]

        # Histórico de multas
        multas_sql = text("""
            SELECT id_multa, numero_ait, data_hora_infracao, descricao_infracao, gravidade, pontuacao, valor_original, condutor_indicado, status_pagamento
            FROM tb_frota_multas
            WHERE id_veiculo = :id_veiculo
            ORDER BY data_hora_infracao DESC;
        """)
        multas = [dict(r._mapping) for r in db.execute(multas_sql, {"id_veiculo": v.id_veiculo}).fetchall()]

        data = dict(v._mapping)
        data["historico_revisoes"] = revisoes
        data["historico_multas"] = multas
        return data
