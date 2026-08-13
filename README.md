# Sistema de Frotas 🚗📦

O **Sistema de Frotas** é uma plataforma web completa para gestão operacional, controle de veículos, logística de insumos/kits, acompanhamento de técnicos e monitoramento de SLA em tempo real.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS
- **Backend / BaaS**: [Firebase](https://firebase.google.com/) (Authentication & Firestore DB)
- **Visualização de Dados & Mapas**:
  - [Chart.js](https://www.chartjs.org/) / [React-ChartJS-2](https://react-chartjs-2.js.org/)
  - [Leaflet](https://leafletjs.com/) / [React-Leaflet](https://react-leaflet.js.org/)
  - [Lucide React](https://lucide.dev/) (Ícones)
- **Relatórios e Exportação**:
  - [jsPDF](https://github.com/parallax/jsPDF) (Geração de PDFs)
  - [XLSX (SheetJS)](https://sheetjs.com/) (Planilhas Excel)

---

## 📋 Funcionalidades Principais

1. **Dashboard Executivo**: KPIs centrais, indicadores visuais em gráficos e estatísticas consolidadas.
2. **Gestão de Frotas e Veículos**: Controle cadastral, localização/geolocalização e status operacional da frota.
3. **Controle de Combustível**: Monitoramento de abastecimentos, média de consumo e custos operacionais.
4. **Estoque & Kits**: Controle de materiais, gestão de inventário e montagem de kits de trabalho.
5. **Devoluções & PPCR**: Processo estruturado de devoluções de materiais e fluxo PPCR.
6. **Gestão de Equipe e Técnicos**: Cadastro de técnicos, acompanhamento de escala e controle de férias.
7. **Painel & Alertas de SLA**: Monitoramento de níveis de serviço, prioridades e alertas de descumprimento de prazos.
8. **Gestec, ATPs & Backlog**: Acompanhamento de requisições pendentes e histórico de atendimento.

---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

## ⚙️ Instalação e Configuração

### 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd frotas
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha com as credenciais do seu projeto Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

---

## 🖥️ Scripts Disponíveis

No diretório do projeto, você pode executar os seguintes comandos:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Live Reload (`http://localhost:5173`) |
| `npm run build` | Compila a aplicação otimizada para produção na pasta `dist/` |
| `npm run preview` | Executa um servidor local para visualizar o build de produção |
| `npm run lint` | Executa a verificação estática do código via ESLint |

---

## 📂 Estrutura do Projeto

```text
frotas/
├── src/
│   ├── components/       # Componentes reutilizáveis (UI, layout, tabelas, modais)
│   ├── config/           # Configuração de integrações (Firebase, etc.)
│   ├── context/          # Contextos globais (AuthContext, ThemeContext)
│   ├── pages/            # Telas do sistema (Dashboard, Veículos, SLA, Estoque, etc.)
│   ├── services/         # Camada de comunicação de dados e Firestore
│   ├── styles/           # Estilos globais e Tailwind CSS
│   ├── utils/            # Funções utilitárias e constantes
│   ├── App.jsx           # Componente raiz e roteamento
│   └── main.jsx          # Ponto de entrada da aplicação
├── public/               # Ativos estáticos públicos
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos e pastas ignorados pelo Git
├── index.html            # Template HTML principal
├── package.json          # Manifesto do projeto e dependências
├── tailwind.config.js    # Configuração do Tailwind CSS
└── vite.config.js        # Configuração do Vite
```

---

## 📄 Licença

Este projeto é privado e de uso restrito.
