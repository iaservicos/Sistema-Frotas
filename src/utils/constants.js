export const MASTER = "admin";
export const MASTERP = "123hg330";
export const SK = "enerfine_admin_v2";

export const TODOS_MODULOS = [
  'dashboard', 'atps', 'tecnicos', 'estoque', 'kits', 
  'veiculos', 'ferias', 'relatorios', 'gestec', 'backlog', 
  'sla', 'alertas_sla', 'ppcr', 'usuarios', 'frota', 
  'incidentes', 'ponto'
];

export const REGIOES_MAP = {
  'SUL': ['PR', 'SC', 'RS'],
  'SUDESTE': ['SP', 'RJ', 'MG', 'ES'],
  'NORDESTE': ['BA', 'CE', 'PE', 'PB', 'RN', 'AL', 'SE', 'PI', 'MA'],
  'NORTE': ['AM', 'PA', 'AC', 'RO', 'RR', 'TO', 'AP'],
  'C-OESTE': ['MT', 'MS', 'GO', 'DF']
};

export function filtrarPorRegiao(lista, regiao, campUF = 'uf') {
  if (!lista || !Array.isArray(lista)) return [];
  if (!regiao || regiao === 'TODOS') return lista;
  const ufsValidas = REGIOES_MAP[regiao] || [];
  if (ufsValidas.length === 0) return lista;

  return lista.filter(item => {
    const uf = (item[campUF] || item.estado || item.uf || '').toUpperCase();
    return ufsValidas.includes(uf);
  });
}

export const ATPS_BASE = [
  {codigo:'8788160',operacao:'POSITIVO BA',nome:'FULL TIME INFORMATICA - (Salvador)',uf:'BA',supervisor:'ALESSANDRO',dispatcher:'MAGNO ALEXANDRE',cc:'1147925'},
  {codigo:'89000601',operacao:'POSITIVO RN',nome:'GILVAN P SOARES - (NATAL)',uf:'RN',supervisor:'DEYVSON',dispatcher:'DEBORA',cc:'89000601'},
  {codigo:'8789471',operacao:'POSITIVO RJ',nome:'ICLIENT INFORMATICA - (RIO DE JANEIRO)',uf:'RJ',supervisor:'ALESSANDRO',dispatcher:'MAGNO ALEXANDRE',cc:'1147916'},
  {codigo:'8788711',operacao:'POSITIVO CE',nome:'POSITIVO CE - (FORTALEZA)',uf:'CE',supervisor:'DEYVSON',dispatcher:'DEBORA',cc:'1147923'},
  {codigo:'2791005',operacao:'POSITIVO PR',nome:'POSITIVO TECNOLOGIA SA CURITIBA - (CURITIBA)',uf:'PR',supervisor:'CLEANDRO',dispatcher:'ANGELICA',cc:'1147913'},
  {codigo:'89000381',operacao:'POSITIVO PB',nome:'SMART MIX - (CABEDELO)',uf:'PB',supervisor:'EVERTON',dispatcher:'CREUZA',cc:'1147919'},
  {codigo:'7812231',operacao:'POSITIVO RS',nome:'METHA INFO - (PORTO ALEGRE)',uf:'RS',supervisor:'CLEANDRO',dispatcher:'ANGELICA',cc:'1147924'},
  {codigo:'2791006',operacao:'POSITIVO MG',nome:'POSITIVO TECNOLOGIA - (BELO HORIZONTE)',uf:'MG',supervisor:'JULIO',dispatcher:'GABRIELA DUTRA',cc:'1147985'},
  {codigo:'89000650',operacao:'POSITIVO AM',nome:'DAJA INFORMATICA E COMERCIO - (MANAUS)',uf:'AM',supervisor:'JULIO',dispatcher:'GABRIELA DUTRA',cc:'1147917'},
  {codigo:'89001910',operacao:'POSITIVO RO',nome:'POSITIVO RO - (PORTO VELHO)',uf:'RO',supervisor:'JULIO',dispatcher:'GABRIELA DUTRA',cc:'1147914'},
  {codigo:'89007090',operacao:'POSITIVO PE',nome:'MUNDIAL PE (NOVO CT PE)',uf:'PE',supervisor:'DEYVSON',dispatcher:'CREUZA',cc:'1147921'},
  {codigo:'89009100',operacao:'POSITIVO PB',nome:'INFOCONNECT COMERCIO E SERVICOS DE INFORMATICA LTDA',uf:'PB',supervisor:'DEYVSON',dispatcher:'CREUZA',cc:'1147919'},
  {codigo:'89009120',operacao:'POSISITO TO',nome:'SOLUCAO TI - COMERCIO DE EQUIPAMENTOS DE INFORMATICA LTDA',uf:'TO',supervisor:'ALESSANDRO',dispatcher:'MAGNO ALEXANDRE',cc:'1145102'},
  {codigo:'89009160',operacao:'POSITIVO RN',nome:'GILVAN P SOARES - (NATAL) - NOVO CT',uf:'RN',supervisor:'DEYVSON',dispatcher:'DEBORA',cc:'1147918'},
  {codigo:'2791040',operacao:'POSITIVO SP',nome:'POSITIVO BARUERI',uf:'SP',supervisor:'ADRIANO / THIAGO',dispatcher:'',cc:'1145920'},
  {codigo:'89009511',operacao:'POSITIVO MT',nome:'INFRAWISE SOLUCOES EM TECNOLOGIA',uf:'MT',supervisor:'DEYVSON',dispatcher:'',cc:'1146002'},
  {codigo:'89009591',operacao:'POSITIVO SC - NOVA',nome:'BRD SOLUCOES EM TECNOLOGIA LTDA',uf:'SC',supervisor:'MAROE',dispatcher:'',cc:'1147986'}
];
