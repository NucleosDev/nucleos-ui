import { v4 as uuidv4 } from "uuid";

// ========== DADOS COMPLETOS PARA TODOS OS Nucleos ==========

// Blocos para o Nucleo 1 (Estudos de React)
export const blocosNucleo1 = [
  {
    id: "bloco-texto-1",
    nucleo_id: "nucleo-1",
    tipo: "texto",
    titulo: "📝 Anotações de React",
    posicao: 0,
    configuracoes: {},
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    dados: {
      conteudo: `# Hooks essenciais

## useState
\`\`\`jsx
const [count, setCount] = useState(0)
\`\`\`

## useEffect
\`\`\`jsx
useEffect(() => {
  document.title = \`Você clicou \${count} vezes\`
}, [count])
\`\`\`

## Próximos estudos:
- [ ] useReducer
- [ ] useContext
- [ ] useMemo
- [ ] useCallback`,
    },
  },
  {
    id: "bloco-colecao-1",
    nucleo_id: "nucleo-1",
    tipo: "colecao",
    titulo: "📚 Livros Técnicos",
    posicao: 1,
    configuracoes: {},
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    dados: {
      colecao: {
        id: "colecao-livros",
        nome: "Biblioteca de Programação",
      },
      campos: [
        { id: "campo-titulo", nome: "Título", tipo_campo: "texto" },
        { id: "campo-autor", nome: "Autor", tipo_campo: "texto" },
        { id: "campo-paginas", nome: "Páginas", tipo_campo: "numero" },
        { id: "campo-status", nome: "Status", tipo_campo: "select" },
      ],
      itens: [
        {
          id: "item-1",
          valores: [
            {
              campo_id: "campo-titulo",
              valor_texto: "O Programador Pragmático",
            },
            { campo_id: "campo-autor", valor_texto: "Andrew Hunt" },
            { campo_id: "campo-paginas", valor_numerico: 320 },
            { campo_id: "campo-status", valor_texto: "Lendo" },
          ],
        },
        {
          id: "item-2",
          valores: [
            { campo_id: "campo-titulo", valor_texto: "Código Limpo" },
            { campo_id: "campo-autor", valor_texto: "Robert Martin" },
            { campo_id: "campo-paginas", valor_numerico: 425 },
            { campo_id: "campo-status", valor_texto: "Quero ler" },
          ],
        },
        {
          id: "item-3",
          valores: [
            { campo_id: "campo-titulo", valor_texto: "Entendendo Algoritmos" },
            { campo_id: "campo-autor", valor_texto: "Aditya Bhargava" },
            { campo_id: "campo-paginas", valor_numerico: 280 },
            { campo_id: "campo-status", valor_texto: "Lido" },
          ],
        },
      ],
    },
  },
  {
    id: "bloco-calendario-1",
    nucleo_id: "nucleo-1",
    tipo: "calendario",
    titulo: "📅 Cronograma de Estudos",
    posicao: 2,
    configuracoes: {},
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    dados: {
      eventos: [
        {
          id: "evento-1",
          titulo: "Estudar Next.js",
          descricao: "App Router e Server Components",
          data_evento: new Date().toISOString(),
          duracao_minutos: 90,
        },
        {
          id: "evento-2",
          titulo: "Revisão de TypeScript",
          descricao: "Types, interfaces e generics",
          data_evento: new Date(Date.now() + 86400000).toISOString(),
          duracao_minutos: 60,
        },
        {
          id: "evento-3",
          titulo: "Projeto prático",
          descricao: "Iniciar o projeto do dashboard",
          data_evento: new Date(Date.now() + 2 * 86400000).toISOString(),
          duracao_minutos: 120,
        },
      ],
    },
  },
  {
    id: "bloco-timer-1",
    nucleo_id: "nucleo-1",
    tipo: "timer",
    titulo: "⏱️ Pomodoro",
    posicao: 3,
    configuracoes: {},
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    dados: {
      timers: [
        {
          id: "timer-foco",
          titulo: "Foco",
          duracao_segundos: 1500, // 25 minutos
          inicio: new Date().toISOString(),
        },
        {
          id: "timer-pausa",
          titulo: "Pausa Curta",
          duracao_segundos: 300, // 5 minutos
        },
        {
          id: "timer-pausa-longa",
          titulo: "Pausa Longa",
          duracao_segundos: 900, // 15 minutos
        },
      ],
    },
  },
];

// Blocos para o Nucleo 2 (Fitness Diário)
export const blocosNucleo2 = [
  {
    id: "bloco-texto-2",
    nucleo_id: "nucleo-2",
    tipo: "texto",
    titulo: "🏋️ Treino da Semana",
    posicao: 0,
    configuracoes: {},
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    dados: {
      conteudo: `# Rotina de Treinos

## Segunda - Peito e Tríceps
- Supino reto: 4x10
- Crucifixo: 3x12
- Tríceps pulley: 3x15

## Quarta - Costas e Bíceps
- Puxada frontal: 4x10
- Remada curvada: 3x12
- Rosca direta: 3x12

## Sexta - Pernas
- Agachamento: 4x10
- Leg press: 3x15
- Cadeira extensora: 3x12`,
    },
  },
  {
    id: "bloco-colecao-2",
    nucleo_id: "nucleo-2",
    tipo: "colecao",
    titulo: "📊 Acompanhamento de Peso",
    posicao: 1,
    configuracoes: {},
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    dados: {
      colecao: {
        id: "colecao-peso",
        nome: "Evolução",
      },
      campos: [
        { id: "campo-data", nome: "Data", tipo_campo: "data" },
        { id: "campo-peso", nome: "Peso (kg)", tipo_campo: "numero" },
        { id: "campo-observacao", nome: "Observação", tipo_campo: "texto" },
      ],
      itens: [
        {
          id: "item-peso-1",
          valores: [
            {
              campo_id: "campo-data",
              valor_data: new Date(Date.now() - 7 * 86400000).toISOString(),
            },
            { campo_id: "campo-peso", valor_numerico: 78.5 },
            { campo_id: "campo-observacao", valor_texto: "Início" },
          ],
        },
        {
          id: "item-peso-2",
          valores: [
            {
              campo_id: "campo-data",
              valor_data: new Date(Date.now() - 3 * 86400000).toISOString(),
            },
            { campo_id: "campo-peso", valor_numerico: 77.8 },
            { campo_id: "campo-observacao", valor_texto: "Progresso" },
          ],
        },
        {
          id: "item-peso-3",
          valores: [
            { campo_id: "campo-data", valor_data: new Date().toISOString() },
            { campo_id: "campo-peso", valor_numerico: 77.2 },
            { campo_id: "campo-observacao", valor_texto: "Atual" },
          ],
        },
      ],
    },
  },
  {
    id: "bloco-calendario-2",
    nucleo_id: "nucleo-2",
    tipo: "calendario",
    titulo: "📅 Dias de Treino",
    posicao: 2,
    configuracoes: {},
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    dados: {
      eventos: [
        {
          id: "evento-treino-1",
          titulo: "Treino A",
          descricao: "Peito e Tríceps",
          data_evento: new Date().toISOString(),
          duracao_minutos: 60,
        },
        {
          id: "evento-treino-2",
          titulo: "Treino B",
          descricao: "Costas e Bíceps",
          data_evento: new Date(Date.now() + 2 * 86400000).toISOString(),
          duracao_minutos: 60,
        },
        {
          id: "evento-treino-3",
          titulo: "Treino C",
          descricao: "Pernas",
          data_evento: new Date(Date.now() + 4 * 86400000).toISOString(),
          duracao_minutos: 75,
        },
      ],
    },
  },
];

// Blocos para o Nucleo 3 (Projeto Cliente)
export const blocosNucleo3 = [
  {
    id: "bloco-texto-3",
    nucleo_id: "nucleo-3",
    tipo: "texto",
    titulo: "📋 Briefing do Projeto",
    posicao: 0,
    configuracoes: {},
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    dados: {
      conteudo: `# Landing Page - Cliente X

## Requisitos
- [x] Página inicial com hero
- [x] Seção de serviços
- [x] Portfólio
- [ ] Página de contato
- [ ] Blog

## Cores
- Primária: #4D7CFF
- Secundária: #00C9A7
- Background: #FFFFFF

## Prazo
- Entrega: 15/04/2024
- Revisões: até 3`,
    },
  },
  {
    id: "bloco-colecao-3",
    nucleo_id: "nucleo-3",
    tipo: "colecao",
    titulo: "✅ Tarefas do Projeto",
    posicao: 1,
    configuracoes: {},
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    dados: {
      colecao: {
        id: "colecao-tarefas",
        nome: "Tarefas",
      },
      campos: [
        { id: "campo-tarefa", nome: "Tarefa", tipo_campo: "texto" },
        { id: "campo-status", nome: "Status", tipo_campo: "select" },
        { id: "campo-prazo", nome: "Prazo", tipo_campo: "data" },
        { id: "campo-concluida", nome: "Concluída", tipo_campo: "booleano" },
      ],
      itens: [
        {
          id: "item-tarefa-1",
          valores: [
            { campo_id: "campo-tarefa", valor_texto: "Criar componentes UI" },
            { campo_id: "campo-status", valor_texto: "Em andamento" },
            {
              campo_id: "campo-prazo",
              valor_data: new Date(Date.now() + 2 * 86400000).toISOString(),
            },
            { campo_id: "campo-concluida", valor_booleano: false },
          ],
        },
        {
          id: "item-tarefa-2",
          valores: [
            {
              campo_id: "campo-tarefa",
              valor_texto: "Implementar responsividade",
            },
            { campo_id: "campo-status", valor_texto: "Pendente" },
            {
              campo_id: "campo-prazo",
              valor_data: new Date(Date.now() + 5 * 86400000).toISOString(),
            },
            { campo_id: "campo-concluida", valor_booleano: false },
          ],
        },
        {
          id: "item-tarefa-3",
          valores: [
            { campo_id: "campo-tarefa", valor_texto: "Configurar API" },
            { campo_id: "campo-status", valor_texto: "Concluído" },
            {
              campo_id: "campo-prazo",
              valor_data: new Date(Date.now() - 2 * 86400000).toISOString(),
            },
            { campo_id: "campo-concluida", valor_booleano: true },
          ],
        },
      ],
    },
  },
];

// Blocos para o Nucleo 4 (Finanças Pessoais)
export const blocosNucleo4 = [
  {
    id: "bloco-colecao-4",
    nucleo_id: "nucleo-4",
    tipo: "colecao",
    titulo: "💰 Orçamento Mensal",
    posicao: 0,
    configuracoes: {},
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    dados: {
      colecao: {
        id: "colecao-orcamento",
        nome: "Gastos",
      },
      campos: [
        { id: "campo-categoria", nome: "Categoria", tipo_campo: "texto" },
        { id: "campo-descricao", nome: "Descrição", tipo_campo: "texto" },
        { id: "campo-valor", nome: "Valor (R$)", tipo_campo: "numero" },
        { id: "campo-data", nome: "Data", tipo_campo: "data" },
      ],
      itens: [
        {
          id: "item-gasto-1",
          valores: [
            { campo_id: "campo-categoria", valor_texto: "Alimentação" },
            { campo_id: "campo-descricao", valor_texto: "Supermercado" },
            { campo_id: "campo-valor", valor_numerico: 450.0 },
            {
              campo_id: "campo-data",
              valor_data: new Date(Date.now() - 5 * 86400000).toISOString(),
            },
          ],
        },
        {
          id: "item-gasto-2",
          valores: [
            { campo_id: "campo-categoria", valor_texto: "Transporte" },
            { campo_id: "campo-descricao", valor_texto: "Uber" },
            { campo_id: "campo-valor", valor_numerico: 120.5 },
            {
              campo_id: "campo-data",
              valor_data: new Date(Date.now() - 3 * 86400000).toISOString(),
            },
          ],
        },
        {
          id: "item-gasto-3",
          valores: [
            { campo_id: "campo-categoria", valor_texto: "Lazer" },
            { campo_id: "campo-descricao", valor_texto: "Cinema" },
            { campo_id: "campo-valor", valor_numerico: 80.0 },
            {
              campo_id: "campo-data",
              valor_data: new Date(Date.now() - 1 * 86400000).toISOString(),
            },
          ],
        },
      ],
    },
  },
];

// Blocos para o Nucleo 5 (Curso de Inglês)
export const blocosNucleo5 = [
  {
    id: "bloco-texto-5",
    nucleo_id: "nucleo-5",
    tipo: "texto",
    titulo: "📚 Vocabulário da Semana",
    posicao: 0,
    configuracoes: {},
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    dados: {
      conteudo: `# Vocabulary

## Business English
- **Meeting** - Reunião
- **Deadline** - Prazo
- **Task** - Tarefa
- **Goal** - Objetivo

## Everyday
- **Groceries** - Compras
- **Neighborhood** - Vizinhança
- **Weather** - Clima
- **Hobbies** - Passatempos`,
    },
  },
];

// Blocos para o Nucleo 6 (Leitura)
export const blocosNucleo6 = [
  {
    id: "bloco-colecao-6",
    nucleo_id: "nucleo-6",
    tipo: "colecao",
    titulo: "📖 Livros Lidos",
    posicao: 0,
    configuracoes: {},
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    dados: {
      colecao: {
        id: "colecao-livros-lidos",
        nome: "Biblioteca Pessoal",
      },
      campos: [
        { id: "campo-livro", nome: "Livro", tipo_campo: "texto" },
        { id: "campo-autor", nome: "Autor", tipo_campo: "texto" },
        { id: "campo-ano", nome: "Ano", tipo_campo: "numero" },
        { id: "campo-nota", nome: "Nota", tipo_campo: "numero" },
      ],
      itens: [
        {
          id: "item-livro-1",
          valores: [
            { campo_id: "campo-livro", valor_texto: "1984" },
            { campo_id: "campo-autor", valor_texto: "George Orwell" },
            { campo_id: "campo-ano", valor_numerico: 1949 },
            { campo_id: "campo-nota", valor_numerico: 10 },
          ],
        },
        {
          id: "item-livro-2",
          valores: [
            { campo_id: "campo-livro", valor_texto: "Duna" },
            { campo_id: "campo-autor", valor_texto: "Frank Herbert" },
            { campo_id: "campo-ano", valor_numerico: 1965 },
            { campo_id: "campo-nota", valor_numerico: 9 },
          ],
        },
      ],
    },
  },
];

// Mapa de blocos por ID do Nucleo
export const blocosPorNucleo: Record<string, any[]> = {
  "nucleo-1": blocosNucleo1,
  "nucleo-2": blocosNucleo2,
  "nucleo-3": blocosNucleo3,
  "nucleo-4": blocosNucleo4,
  "nucleo-5": blocosNucleo5,
  "nucleo-6": blocosNucleo6,
};

// Função segura que sempre retorna um array (vazio se não encontrar)
export function getBlocosPorNucleoSeguro(nucleoId: string): any[] {
  return blocosPorNucleo[nucleoId] || [];
}
