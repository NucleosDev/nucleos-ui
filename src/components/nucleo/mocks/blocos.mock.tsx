import type { BlocoWithData } from "../types/bloco-components.types";
import { getBlocosPorNucleoSeguro } from "./data-mocks";


// mock de blocos
export const mockBlocos: BlocoWithData[] = [
  // Bloco de Texto
  {
    id: "bloco-texto-1",
    nucleo_id: "nucleo-1",
    tipo: "texto",
    titulo: "Anotações Importantes",
    posicao: 0,
    configuracoes: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dados: {
      conteudo: `# Aprendizados de hoje\n\n- Hooks do React: useState e useEffect\n- Next.js App Router é muito intuitivo\n- Tailwind CSS acelera o desenvolvimento\n\n## Próximos passos\n- Estudar Server Components\n- Praticar com um projeto real`,
    },
  },

  // Bloco de Coleção (Tabela)
  {
    id: "bloco-colecao-1",
    nucleo_id: "nucleo-1",
    tipo: "colecao",
    titulo: "Livros para Ler",
    posicao: 1,
    configuracoes: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dados: {
      colecao: {
        id: "colecao1",
        bloco_id: "bloco-colecao-1",
        nome: "Biblioteca",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      campos: [
        {
          id: "campo1",
          colecao_id: "colecao1",
          nome: "Título",
          tipo_campo: "texto",
          created_at: "",
          updated_at: "",
        },
        {
          id: "campo2",
          colecao_id: "colecao1",
          nome: "Autor",
          tipo_campo: "texto",
          created_at: "",
          updated_at: "",
        },
        {
          id: "campo3",
          colecao_id: "colecao1",
          nome: "Páginas",
          tipo_campo: "numero",
          created_at: "",
          updated_at: "",
        },
        {
          id: "campo4",
          colecao_id: "colecao1",
          nome: "Lido",
          tipo_campo: "booleano",
          created_at: "",
          updated_at: "",
        },
      ],
      itens: [
        {
          id: "item1",
          colecao_id: "colecao1",
          created_at: "",
          updated_at: "",
          valores: [
            {
              id: "v1",
              item_id: "item1",
              campo_id: "campo1",
              valor_texto: "O Programador Pragmático",
            },
            {
              id: "v2",
              item_id: "item1",
              campo_id: "campo2",
              valor_texto: "Andrew Hunt",
            },
            {
              id: "v3",
              item_id: "item1",
              campo_id: "campo3",
              valor_numerico: 320,
            },
            {
              id: "v4",
              item_id: "item1",
              campo_id: "campo4",
              valor_booleano: true,
            },
          ],
        },
        {
          id: "item2",
          colecao_id: "colecao1",
          created_at: "",
          updated_at: "",
          valores: [
            {
              id: "v5",
              item_id: "item2",
              campo_id: "campo1",
              valor_texto: "Código Limpo",
            },
            {
              id: "v6",
              item_id: "item2",
              campo_id: "campo2",
              valor_texto: "Robert Martin",
            },
            {
              id: "v7",
              item_id: "item2",
              campo_id: "campo3",
              valor_numerico: 425,
            },
            {
              id: "v8",
              item_id: "item2",
              campo_id: "campo4",
              valor_booleano: false,
            },
          ],
        },
      ],
    },
  },

  // Bloco de Calendário
  {
    id: "bloco-calendario-1",
    nucleo_id: "nucleo-1",
    tipo: "calendario",
    titulo: "Cronograma de Estudos",
    posicao: 2,
    configuracoes: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dados: {
      eventos: [
        {
          id: "evento1",
          nucleo_id: "nucleo-1",
          titulo: "Estudar React Hooks",
          descricao: "Capítulo 3 do curso",
          data_evento: new Date().toISOString(),
          duracao_minutos: 60,
          created_at: "",
          updated_at: "",
        },
        {
          id: "evento2",
          nucleo_id: "nucleo-1",
          titulo: "Revisão de TypeScript",
          descricao: "Preparação para o projeto",
          data_evento: new Date(Date.now() + 86400000).toISOString(),
          duracao_minutos: 90,
          created_at: "",
          updated_at: "",
        },
      ],
    },
  },

  // Bloco de Timer
  {
    id: "bloco-timer-1",
    nucleo_id: "nucleo-1",
    tipo: "timer",
    titulo: "Pomodoro",
    posicao: 3,
    configuracoes: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dados: {
      timers: [
        {
          id: "timer1",
          nucleo_id: "nucleo-1",
          titulo: "Foco",
          inicio: new Date().toISOString(),
          duracao_segundos: 1500,
          created_at: "",
        },
        {
          id: "timer2",
          nucleo_id: "nucleo-1",
          titulo: "Pausa Curta",
          duracao_segundos: 300,
          created_at: "",
        },
      ],
    },
  },
];

// ===== FUNÇÃO PARA PEGAR BLOCOS DE UM Nucleo ESPECÍFICO =====
export function getBlocosPorNucleo(nucleoId: string): BlocoWithData[] {
  if (nucleoId === "nucleo-1") {
    return mockBlocos; // Retorna todos os blocos para o Nucleo 1
  }
  return []; // Outros Nucleos não têm blocos no mock
}

// ===== COMPONENTE DE DEMONSTRAÇÃO DOS BLOCOS =====
export function BlocosMock() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Tipos de Blocos</h2>
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">📝 Bloco de Texto</h3>
          <p className="text-sm text-muted-foreground">
            Para anotações, ideias e documentação
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">📊 Bloco de Coleção</h3>
          <p className="text-sm text-muted-foreground">
            Tabelas e bancos de dados personalizados
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">📅 Bloco de Calendário</h3>
          <p className="text-sm text-muted-foreground">
            Eventos, prazos e cronogramas
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">⏱️ Bloco de Timer</h3>
          <p className="text-sm text-muted-foreground">
            Pomodoro, cronômetros e contagens
          </p>
        </div>
      </div>
    </div>
  );
}


