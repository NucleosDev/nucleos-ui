import { gerarSlug } from "@/lib/slug-utils";
import { artigoSlugOptions, stopWords } from "@/lib/slug-config";

// Interface para tipagem
export interface Artigo {
  titulo: string;
  slug: string;
  resumo: string;
  tempoLeitura: string;
  visualizacoes: string;
  data: string;
  categoria: string;
  categoriaCor: string;
  autor: string;
  conteudo: string;
}

// Artigos de PRIMEIROS PASSOS (8 artigos)
export const primeirosPassosArtigos: Artigo[] = [
  {
    titulo: "O que é o Nucleos?",
    slug: gerarSlug("O que é o Nucleos?", artigoSlugOptions), // "o-que-e-nucleos"
    resumo:
      "Conheça a plataforma de produtividade modular que vai transformar sua organização pessoal.",
    tempoLeitura: "4 min",
    visualizacoes: "5.2k",
    data: "2024-01-05",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `O Nucleos é uma plataforma de produtividade pensada para organizar sua vida de forma simples, flexível e inteligente.

Diferente de ferramentas tradicionais, aqui você não fica preso a um único formato.
Você monta seu próprio sistema, do seu jeito.`,
  },
  {
    titulo: "Como criar sua conta",
    slug: gerarSlug("Como criar sua conta no Nucleos", artigoSlugOptions), // "criar-conta-nucleos"
    resumo:
      "Passo a passo para criar sua conta e começar sua jornada de produtividade.",
    tempoLeitura: "3 min",
    visualizacoes: "4.8k",
    data: "2024-01-06",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Primeiros passos com Nucleos",
    slug: gerarSlug("Primeiros passos com Nucleos", artigoSlugOptions), // "primeiros-passos-nucleos"
    resumo: "Entenda o conceito de Nucleos e como eles funcionam na prática.",
    tempoLeitura: "4 min",
    visualizacoes: "3.9k",
    data: "2024-01-08",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Entendendo o dashboard",
    slug: gerarSlug("Entendendo o dashboard do Nucleos", artigoSlugOptions), // "entendendo-dashboard-nucleos"
    resumo:
      "Conheça cada seção do seu painel principal e aprenda a navegar pela plataforma.",
    tempoLeitura: "5 min",
    visualizacoes: "3.2k",
    data: "2024-01-10",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Configurando seu perfil",
    slug: gerarSlug("Configurando seu perfil no Nucleos", artigoSlugOptions), // "configurando-perfil-nucleos"
    resumo: "Aprenda a personalizar seu perfil, foto, tema e preferências.",
    tempoLeitura: "3 min",
    visualizacoes: "2.7k",
    data: "2024-01-12",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Primeiro núcleo: guia rápido",
    slug: gerarSlug("Primeiro núcleo guia rápido", artigoSlugOptions), // "primeiro-nucleo-guia-rapido"
    resumo:
      "Crie seu primeiro núcleo em menos de 5 minutos com este guia prático.",
    tempoLeitura: "4 min",
    visualizacoes: "4.1k",
    data: "2024-01-14",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Navegando pelo app mobile",
    slug: gerarSlug("Navegando pelo app mobile do Nucleos", artigoSlugOptions), // "navegando-app-mobile-nucleos"
    resumo: "Descubra como usar o Nucleos no celular com dicas de navegação.",
    tempoLeitura: "3 min",
    visualizacoes: "2.3k",
    data: "2024-01-16",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Atalhos e produtividade",
    slug: gerarSlug("Atalhos e produtividade no Nucleos", artigoSlugOptions), // "atalhos-produtividade-nucleos"
    resumo:
      "Aprenda os atalhos de teclado e dicas para usar o Nucleos mais rápido.",
    tempoLeitura: "3 min",
    visualizacoes: "1.9k",
    data: "2024-01-18",
    categoria: "Primeiros Passos",
    categoriaCor: "#4D7CFF",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
];

// Artigos de Nucleos E BLOCOS (12 artigos)
export const nucleosBlocosArtigos: Artigo[] = [
  {
    titulo: "O que são Nucleos?",
    slug: gerarSlug("O que são Nucleos no Nucleos", artigoSlugOptions), // "nucleos"
    resumo:
      "Entenda o conceito fundamental do Nucleos e como eles organizam sua vida.",
    tempoLeitura: "4 min",
    visualizacoes: "4.5k",
    data: "2024-01-05",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `Os núcleos são grupos organizados dentro de instituições (como universidades, projetos ou comunidades) 
    que se dedicam a uma área específica de atuação, estudo ou serviço.
    Eles reúnem pessoas com um objetivo em comum — por exemplo: desenvolver projetos, 
    prestar serviços à comunidade ou aprofundar conhecimentos em determinada área.`,
  },
  {
    titulo: "Tipos de blocos disponíveis",
    slug: gerarSlug(
      "Tipos de blocos disponíveis no Nucleos",
      artigoSlugOptions,
    ), // "tipos-blocos-disponiveis"
    resumo:
      "Conheça todos os tipos de blocos que você pode adicionar aos seus Nucleos.",
    tempoLeitura: "5 min",
    visualizacoes: "3.8k",
    data: "2024-01-07",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `Os blocos disponíveis são componentes estruturais utilizados para organizar e apresentar informações dentro da plataforma. 
    Cada bloco possui uma função específica, como exibir textos, imagens, projetos ou dados, 
    permitindo a criação de páginas dinâmicas, organizadas e de fácil navegação.`,
  },
  {
    titulo: "Criando seu primeiro bloco",
    slug: gerarSlug("Criando seu primeiro bloco no Nucleos", artigoSlugOptions), // "criando-primeiro-bloco"
    resumo:
      "Guia passo a passo para adicionar e configurar blocos nos seus Nucleos.",
    tempoLeitura: "4 min",
    visualizacoes: "3.2k",
    data: "2024-01-09",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `A criação do primeiro bloco consiste no desenvolvimento de um componente reutilizável responsável por exibir uma unidade específica de conteúdo. 
    Esse processo permite estruturar páginas de forma modular, facilitando a manutenção, escalabilidade e organização da aplicação.`,
  },
  {
    titulo: "Organizando blocos dentro dos Nucleos",
    slug: gerarSlug("Organizando blocos dentro dos Nucleos", artigoSlugOptions), // "organizando-blocos-dentro-nucleos"
    resumo:
      "Aprenda a organizar seus blocos de forma eficiente com drag-and-drop e grupos.",
    tempoLeitura: "3 min",
    visualizacoes: "2.9k",
    data: "2024-01-11",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `A organização de blocos dentro dos Núcleos é essencial para manter a estrutura das páginas clara, escalável e fácil de manter. 
    Cada núcleo pode conter diferentes blocos, organizados de forma estratégica para apresentar informações de maneira eficiente.`,
  },
  {
    titulo: "Personalizando seus Nucleos",
    slug: gerarSlug("Personalizando seus Nucleos", artigoSlugOptions), // "personalizando-nucleos"
    resumo:
      "Deixe seus Nucleos com a sua cara com cores, ícones e capas personalizadas.",
    tempoLeitura: "4 min",
    visualizacoes: "2.7k",
    data: "2024-01-13",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `A personalização dos Núcleos consiste na adaptação visual e estrutural de cada área da plataforma, permitindo definir temas, blocos e organização do conteúdo. 
    Esse processo possibilita a criação de experiências únicas, alinhadas às necessidades de cada grupo e ao seu contexto de atuação.`,
  },
  {
    titulo: "Como criar seu primeiro Núcleo",
    slug: gerarSlug("Como criar seu primeiro Núcleo", artigoSlugOptions), // "criar-primeiro-nucleo"
    resumo: "Guia passo a passo para criar seu primeiro núcleo no Nucleos",
    tempoLeitura: "5 min",
    visualizacoes: "3.2k",
    data: "2024-01-12",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `A criação de um Núcleo consiste na definição de uma estrutura que organiza conteúdos, blocos e identidade visual em um único espaço. 
    Esse processo permite centralizar informações e facilitar a apresentação de projetos, equipes e ações dentro da plataforma.`,
  },
  {
    titulo: "Arquivando e excluindo Nucleos",
    slug: gerarSlug("Arquivando e excluindo Nucleos", artigoSlugOptions), // "arquivando-excluindo-nucleos"
    resumo:
      "Saiba como gerenciar Nucleos antigos sem perder dados importantes.",
    tempoLeitura: "3 min",
    visualizacoes: "2.1k",
    data: "2024-01-15",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `A gestão de Núcleos inclui ações como arquivar e excluir, 
    permitindo manter a plataforma organizada e atualizada sem perder informações importantes.`,
  },
  {
    titulo: "Duplicando Nucleos",
    slug: gerarSlug("Duplicando Nucleos", artigoSlugOptions), // "duplicando-nucleos"
    resumo:
      "Aprenda a duplicar Nucleos existentes para criar templates e economizar tempo.",
    tempoLeitura: "3 min",
    visualizacoes: "1.8k",
    data: "2024-01-17",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `A duplicação de Núcleos consiste na criação de uma cópia de um núcleo existente, preservando sua estrutura, blocos e configurações. 
    Essa funcionalidade facilita a criação de novos conteúdos de forma rápida e padronizada dentro da plataforma.`,
  },
  {
    titulo: "Compartilhando Nucleos",
    slug: gerarSlug("Compartilhando Nucleos", artigoSlugOptions), // "compartilhando-nucleos"
    resumo:
      "Descubra como compartilhar Nucleos com outros usuários e colaborar em equipe.",
    tempoLeitura: "4 min",
    visualizacoes: "1.6k",
    data: "2024-01-19",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `O compartilhamento de Núcleos consiste na possibilidade de conceder acesso a outros usuários, permitindo visualização ou edição do conteúdo. 
    Essa funcionalidade promove a colaboração e facilita a gestão conjunta das informações dentro da plataforma.`,
  },
  {
    titulo: "Bloco de tarefas avançado",
    slug: gerarSlug("Bloco de tarefas avançado", artigoSlugOptions), // "bloco-tarefas-avancado"
    resumo:
      "Domine todas as funcionalidades do bloco de tarefas: prioridades, etiquetas e mais.",
    tempoLeitura: "5 min",
    visualizacoes: "2.2k",
    data: "2024-01-21",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `O bloco de tarefas avançado é um componente que permite gerenciar atividades dentro de um Núcleo, organizando tarefas por status, prioridade e responsáveis. 
    Essa funcionalidade facilita o acompanhamento de projetos e melhora a colaboração entre os membros.`,
  },
  {
    titulo: "Bloco de hábitos inteligentes",
    slug: gerarSlug("Bloco de hábitos inteligentes", artigoSlugOptions), // "bloco-habitos-inteligentes"
    resumo:
      "Configure hábitos com frequências personalizadas e acompanhe sua consistência.",
    tempoLeitura: "4 min",
    visualizacoes: "2.0k",
    data: "2024-01-23",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Bloco de timer e Pomodoro",
    slug: gerarSlug("Bloco de timer e Pomodoro", artigoSlugOptions), // "bloco-timer-pomodoro"
    resumo:
      "Use o timer integrado para técnicas Pomodoro e registro de tempo focado.",
    tempoLeitura: "4 min",
    visualizacoes: "1.9k",
    data: "2024-01-25",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Bloco de notas e documentação",
    slug: gerarSlug("Bloco de notas e documentação", artigoSlugOptions), // "bloco-notas-documentacao"
    resumo:
      "Crie notas ricas com formatação, imagens e links dentro dos seus Nucleos.",
    tempoLeitura: "4 min",
    visualizacoes: "1.5k",
    data: "2024-01-27",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
];

// Artigos de GAMIFICAÇÃO (6 artigos)
export const gamificacaoArtigos: Artigo[] = [
  {
    titulo: "Sistema de XP explicado",
    slug: gerarSlug("Sistema de XP explicado", artigoSlugOptions), // "sistema-xp-explicado"
    resumo:
      "Entenda como funciona a experiência e como ganhar pontos no Nucleos.",
    tempoLeitura: "4 min",
    visualizacoes: "3.5k",
    data: "2024-01-10",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Níveis e recompensas",
    slug: gerarSlug("Níveis e recompensas", artigoSlugOptions), // "niveis-recompensas"
    resumo:
      "Descubra o que cada nível desbloqueia e como acelerar sua evolução.",
    tempoLeitura: "5 min",
    visualizacoes: "2.8k",
    data: "2024-01-12",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Conquistas e badges",
    slug: gerarSlug("Conquistas e badges", artigoSlugOptions), // "conquistas-badges"
    resumo:
      "Conheça todas as conquistas que você pode desbloquear e mostre suas medalhas.",
    tempoLeitura: "4 min",
    visualizacoes: "2.3k",
    data: "2024-01-15",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Rankings e competição",
    slug: gerarSlug("Rankings e competição", artigoSlugOptions), // "rankings-competicao"
    resumo:
      "Participe de rankings semanais e compare seu progresso com amigos.",
    tempoLeitura: "3 min",
    visualizacoes: "1.9k",
    data: "2024-01-18",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Evolução visual do perfil",
    slug: gerarSlug("Evolução visual do perfil", artigoSlugOptions), // "evolucao-visual-perfil"
    resumo: "Veja como seu perfil muda conforme você sobe de nível.",
    tempoLeitura: "3 min",
    visualizacoes: "1.6k",
    data: "2024-01-20",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
    autor: "Equipe Nucleos",
    conteudo: `A evolução visual do perfil consiste na representação gráfica do progresso do usuário, utilizando elementos como avatar, temas e badges. 
    Essa abordagem torna a progressão mais intuitiva e motivadora, reforçando o engajamento na plataforma.`,
  },
  {
    titulo: "Gamificação nas tarefas",
    slug: gerarSlug("Gamificação nas tarefas", artigoSlugOptions), // "gamificacao-tarefas"
    resumo:
      "Como a gamificação transforma tarefas comuns em desafios motivadores.",
    tempoLeitura: "4 min",
    visualizacoes: "1.4k",
    data: "2024-01-22",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Entendendo o sistema de XP",
    slug: gerarSlug("Entendendo o sistema de XP", artigoSlugOptions), // "entendendo-sistema-xp"
    resumo: "Descubra como ganhar experiência e subir de nível no Nucleos",
    tempoLeitura: "4 min",
    visualizacoes: "2.8k",
    data: "2024-01-18",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
];

// Artigos de METAS E STREAKS (5 artigos)
export const metasStreaksArtigos: Artigo[] = [
  {
    titulo: "O que são streaks?",
    slug: gerarSlug("O que são streaks", artigoSlugOptions), // "streaks"
    resumo: "Entenda o conceito de streaks e como eles ajudam na consistência.",
    tempoLeitura: "3 min",
    visualizacoes: "2.7k",
    data: "2024-01-08",
    categoria: "Metas e Streaks",
    categoriaCor: "#FF8C42",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Dicas para manter streaks",
    slug: gerarSlug("Dicas para manter streaks", artigoSlugOptions), // "dicas-manter-streaks"
    resumo:
      "Estratégias práticas para não quebrar sua sequência de produtividade.",
    tempoLeitura: "5 min",
    visualizacoes: "2.4k",
    data: "2024-01-10",
    categoria: "Metas e Streaks",
    categoriaCor: "#FF8C42",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Como definir metas inteligentes",
    slug: gerarSlug("Como definir metas inteligentes", artigoSlugOptions), // "definir-metas-inteligentes"
    resumo:
      "Aprenda o método SMART e outras técnicas para criar metas alcançáveis.",
    tempoLeitura: "5 min",
    visualizacoes: "2.1k",
    data: "2024-01-12",
    categoria: "Metas e Streaks",
    categoriaCor: "#FF8C42",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Metas de curto vs longo prazo",
    slug: gerarSlug("Metas de curto vs longo prazo", artigoSlugOptions), // "metas-curto-longo-prazo"
    resumo:
      "Equilibre objetivos diários com metas de longo prazo para manter a motivação.",
    tempoLeitura: "4 min",
    visualizacoes: "1.7k",
    data: "2024-01-15",
    categoria: "Metas e Streaks",
    categoriaCor: "#FF8C42",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Acompanhamento de progresso",
    slug: gerarSlug("Acompanhamento de progresso", artigoSlugOptions), // "acompanhamento-progresso"
    resumo:
      "Use gráficos e métricas para ver sua evolução em direção às metas.",
    tempoLeitura: "4 min",
    visualizacoes: "1.5k",
    data: "2024-01-18",
    categoria: "Metas e Streaks",
    categoriaCor: "#FF8C42",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
];

// Artigos de PRODUTIVIDADE (7 artigos)
export const produtividadeArtigos: Artigo[] = [
  {
    titulo: "Método GTD no Nucleos",
    slug: gerarSlug("Método GTD no Nucleos", artigoSlugOptions), // "metodo-gtd-nucleos"
    resumo:
      "Aplique o Getting Things Done (GTD) usando a estrutura de Nucleos e blocos.",
    tempoLeitura: "5 min",
    visualizacoes: "2.3k",
    data: "2024-01-05",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Pomodoro Technique",
    slug: gerarSlug("Pomodoro Technique no Nucleos", artigoSlugOptions), // "pomodoro-technique-nucleos"
    resumo:
      "Use a técnica Pomodoro com o timer integrado para maximizar o foco.",
    tempoLeitura: "4 min",
    visualizacoes: "2.1k",
    data: "2024-01-07",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Matriz Eisenhower",
    slug: gerarSlug("Matriz Eisenhower no Nucleos", artigoSlugOptions), // "matriz-eisenhower-nucleos"
    resumo: "Priorize tarefas usando a matriz de urgência e importância.",
    tempoLeitura: "4 min",
    visualizacoes: "1.9k",
    data: "2024-01-10",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Deep Work",
    slug: gerarSlug("Deep Work no Nucleos", artigoSlugOptions), // "deep-work-nucleos"
    resumo: "Estratégias para alcançar o estado de foco profundo no Nucleos.",
    tempoLeitura: "4 min",
    visualizacoes: "1.7k",
    data: "2024-01-12",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Time Blocking",
    slug: gerarSlug("Time Blocking no Nucleos", artigoSlugOptions), // "time-blocking-nucleos"
    resumo:
      "Organize seu dia em blocos de tempo dedicados a atividades específicas.",
    tempoLeitura: "4 min",
    visualizacoes: "1.6k",
    data: "2024-01-15",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Eating the Frog",
    slug: gerarSlug("Eating the Frog no Nucleos", artigoSlugOptions), // "eating-frog-nucleos"
    resumo:
      "Comece o dia pela tarefa mais difícil e aumente sua produtividade.",
    tempoLeitura: "3 min",
    visualizacoes: "1.4k",
    data: "2024-01-18",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Hábitos atômicos",
    slug: gerarSlug("Hábitos atômicos no Nucleos", artigoSlugOptions), // "habitos-atomicos-nucleos"
    resumo: "Aplique os princípios do livro Hábitos Atômicos no Nucleos.",
    tempoLeitura: "5 min",
    visualizacoes: "2.0k",
    data: "2024-01-20",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Método Pomodoro no Nucleos",
    slug: gerarSlug("Método Pomodoro no Nucleos", artigoSlugOptions), // "metodo-pomodoro-nucleos"
    resumo: "Use a técnica Pomodoro para aumentar sua produtividade",
    tempoLeitura: "4 min",
    visualizacoes: "1.5k",
    data: "2024-01-25",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
];

// Artigos de ANÁLISES (4 artigos)
export const analisesArtigos: Artigo[] = [
  {
    titulo: "Interpretando seus gráficos",
    slug: gerarSlug("Interpretando seus gráficos", artigoSlugOptions), // "interpretando-graficos"
    resumo: "Aprenda a ler e extrair insights dos gráficos de progresso.",
    tempoLeitura: "4 min",
    visualizacoes: "1.8k",
    data: "2024-01-05",
    categoria: "Análises",
    categoriaCor: "#8CD47E",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Relatórios semanais",
    slug: gerarSlug("Relatórios semanais", artigoSlugOptions), // "relatorios-semanais"
    resumo: "Receba relatórios automáticos com análise da sua semana.",
    tempoLeitura: "3 min",
    visualizacoes: "1.5k",
    data: "2024-01-08",
    categoria: "Análises",
    categoriaCor: "#8CD47E",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Métricas de produtividade",
    slug: gerarSlug("Métricas de produtividade", artigoSlugOptions), // "metricas-produtividade"
    resumo: "Conheça as principais métricas para avaliar sua eficiência.",
    tempoLeitura: "4 min",
    visualizacoes: "1.3k",
    data: "2024-01-12",
    categoria: "Análises",
    categoriaCor: "#8CD47E",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Exportando dados",
    slug: gerarSlug("Exportando dados", artigoSlugOptions), // "exportando-dados"
    resumo: "Exporte seus dados para análise externa ou backup.",
    tempoLeitura: "3 min",
    visualizacoes: "1.1k",
    data: "2024-01-15",
    categoria: "Análises",
    categoriaCor: "#8CD47E",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
  {
    titulo: "Interpretando seus gráficos",
    slug: gerarSlug("Interpretando seus gráficos", artigoSlugOptions), // "interpretando-graficos"
    resumo: "Entenda as métricas e acompanhe sua evolução",
    tempoLeitura: "5 min",
    visualizacoes: "1.2k",
    data: "2024-01-28",
    categoria: "Análises",
    categoriaCor: "#8CD47E",
    autor: "Equipe Nucleos",
    conteudo: `...`,
  },
];

// Exportação consolidada para fácil acesso
export const todosArtigos: Record<string, Artigo[]> = {
  "primeiros-passos": primeirosPassosArtigos,
  "nucleos-e-blocos": nucleosBlocosArtigos,
  gamificacao: gamificacaoArtigos,
  "metas-e-streaks": metasStreaksArtigos,
  produtividade: produtividadeArtigos,
  analises: analisesArtigos,
};

// Para acesso direto por slug (artigos individuais)
export const artigosPorSlug: Record<string, Artigo> = {};

// Popular o objeto de artigos por slug
Object.values(todosArtigos).forEach((categoriaArtigos) => {
  categoriaArtigos.forEach((artigo) => {
    artigosPorSlug[artigo.slug] = artigo;
  });
});
