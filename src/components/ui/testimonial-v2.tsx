import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles, Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// --- Types ---
interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  profession: string;
  xp?: string;
  nivel?: number;
}

// --- Data com profissionais diversos ---
const testimonials: Testimonial[] = [
  // Programadores
  {
    text: "O Nucleos transformou minha rotina de estudos. Consigo organizar meus projetos e acompanhar minha evolução em tecnologia de forma motivadora.",
    image: "/placeholder-user.jpg",
    name: "Rafael Costa",
    role: "Desenvolvedor Full Stack",
    profession: "programador",
    xp: "12.450 XP",
    nivel: 24,
  },
  {
    text: "Uso para gerenciar meus estudos de novas linguagens. A gamificação me manteve consistente por 6 meses seguidos!",
    image: "/placeholder-user.jpg",
    name: "Camila Fernandes",
    role: "Engenheira de Software",
    profession: "programador",
    xp: "8.320 XP",
    nivel: 18,
  },
  {
    text: "Minha equipe adotou o Nucleos para organizar sprints e tarefas. A produtividade aumentou 40%.",
    image: "/placeholder-user.jpg",
    name: "Lucas Mendes",
    role: "Tech Lead",
    profession: "programador",
    xp: "15.800 XP",
    nivel: 32,
  },

  // Médicos e Profissionais da Saúde
  {
    text: "Como médica, preciso organizar plantões, estudos e vida pessoal. O Nucleos me ajuda a equilibrar tudo.",
    image: "/placeholder-user.jpg",
    name: "Dra. Juliana Martins",
    role: "Médica Cardiologista",
    profession: "medico",
    xp: "9.200 XP",
    nivel: 21,
  },
  {
    text: "Uso para acompanhar minha rotina de exercícios e alimentação. Perdi 12kg e ganhei saúde!",
    image: "/placeholder-user.jpg",
    name: "Dr. Paulo Henrique",
    role: "Nutricionista",
    profession: "nutricionista",
    xp: "7.800 XP",
    nivel: 16,
  },
  {
    text: "Organizo meus pacientes e evolução de tratamentos. Fundamental no meu dia a dia.",
    image: "/placeholder-user.jpg",
    name: "Dra. Amanda Souza",
    role: "Dentista",
    profession: "dentista",
    xp: "6.500 XP",
    nivel: 14,
  },

  // Engenheiros
  {
    text: "Projetos complexos exigem organização. Com o Nucleos, consigo dividir cada etapa e acompanhar o progresso da equipe.",
    image: "/placeholder-user.jpg",
    name: "Carlos Eduardo",
    role: "Engenheiro Civil",
    profession: "engenheiro",
    xp: "11.200 XP",
    nivel: 23,
  },
  {
    text: "Uso para gestão de obras e prazos. Nunca perdi um deadline depois que comecei a usar.",
    image: "/placeholder-user.jpg",
    name: "Mariana Santos",
    role: "Engenheira de Produção",
    profession: "engenheiro",
    xp: "10.100 XP",
    nivel: 22,
  },

  // Empresários e Comerciantes
  {
    text: "Gerencio minha loja, estoque e metas de venda. Meu negócio cresceu 200% em 1 ano.",
    image: "/placeholder-user.jpg",
    name: "Roberto Almeida",
    role: "Empresário",
    profession: "empresario",
    xp: "18.500 XP",
    nivel: 37,
  },
  {
    text: "Uso para organizar as tarefas da minha equipe de vendas. Resultados incríveis!",
    image: "/placeholder-user.jpg",
    name: "Fernanda Lima",
    role: "Comerciante",
    profession: "comerciante",
    xp: "8.900 XP",
    nivel: 19,
  },
  {
    text: "Controle de metas e comissões ficou muito mais fácil. Recomendo!",
    image: "/placeholder-user.jpg",
    name: "João Vitor",
    role: "Vendedor",
    profession: "vendedor",
    xp: "7.200 XP",
    nivel: 15,
  },

  // Bancários e Financeiros
  {
    text: "Organizo minhas metas financeiras e investimentos. Já conquistei 3 objetivos esse ano.",
    image: "/placeholder-user.jpg",
    name: "Patrícia Oliveira",
    role: "Bancária",
    profession: "bancario",
    xp: "9.800 XP",
    nivel: 20,
  },
  {
    text: "Uso para planejamento de aposentadoria e controle de gastos. Vida financeira organizada.",
    image: "/placeholder-user.jpg",
    name: "Antônio Carlos",
    role: "Aposentado",
    profession: "aposentado",
    xp: "5.600 XP",
    nivel: 12,
  },

  // Psicólogos
  {
    text: "Acompanho meus pacientes e exercícios de terapia com os Nucleos. Ferramenta essencial.",
    image: "/placeholder-user.jpg",
    name: "Dra. Beatriz Rocha",
    role: "Psicóloga",
    profession: "psicologo",
    xp: "7.400 XP",
    nivel: 16,
  },

  // Universitários
  {
    text: "Organizo todas as matérias da faculdade. Minhas notas subiram de 7 para 9.5!",
    image: "/placeholder-user.jpg",
    name: "Gabriel Santos",
    role: "Estudante de Medicina",
    profession: "universitario",
    xp: "6.800 XP",
    nivel: 14,
  },
  {
    text: "Uso para estudar para concursos. Já passei em 2° lugar no último que fiz.",
    image: "/placeholder-user.jpg",
    name: "Ana Clara",
    role: "Universitária",
    profession: "universitario",
    xp: "9.300 XP",
    nivel: 20,
  },
];

// Separar em colunas com diversidade
const firstColumn = testimonials.slice(0, 5);
const secondColumn = testimonials.slice(5, 10);
const thirdColumn = testimonials.slice(10, 15);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(
                ({ text, image, name, role, profession, xp, nivel }, i) => (
                  <motion.li
                    key={`${index}-${i}`}
                    aria-hidden={index === 1 ? "true" : "false"}
                    tabIndex={index === 1 ? -1 : 0}
                    whileHover={{
                      scale: 1.03,
                      y: -8,
                      boxShadow:
                        "0 25px 50px -12px rgba(77, 124, 255, 0.15), 0 10px 10px -5px rgba(0, 201, 167, 0.04), 0 0 0 1px rgba(77, 124, 255, 0.1)",
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      },
                    }}
                    whileFocus={{
                      scale: 1.03,
                      y: -8,
                      boxShadow:
                        "0 25px 50px -12px rgba(77, 124, 255, 0.15), 0 10px 10px -5px rgba(0, 201, 167, 0.04), 0 0 0 1px rgba(77, 124, 255, 0.1)",
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      },
                    }}
                    className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-lg shadow-black/5 max-w-xs w-full bg-white dark:bg-neutral-900 transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-[#4D7CFF]/30 relative overflow-hidden"
                  >
                    {/* Ícone de aspas decorativo */}
                    <Quote className="absolute top-4 right-4 size-8 text-[#4D7CFF]/10 dark:text-[#4D7CFF]/5" />

                    <blockquote className="m-0 p-0 relative z-10">
                      {/* Badge de profissão */}
                      <div className="mb-3">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5"
                          style={{
                            backgroundColor:
                              profession === "programador"
                                ? "#4D7CFF10"
                                : profession === "medico"
                                  ? "#00C9A710"
                                  : profession === "engenheiro"
                                    ? "#2EBD5910"
                                    : profession === "empresario"
                                      ? "#FFD70010"
                                      : "#80808010",
                            borderColor:
                              profession === "programador"
                                ? "#4D7CFF30"
                                : profession === "medico"
                                  ? "#00C9A730"
                                  : profession === "engenheiro"
                                    ? "#2EBD5930"
                                    : profession === "empresario"
                                      ? "#FFD70030"
                                      : "#80808030",
                            color:
                              profession === "programador"
                                ? "#4D7CFF"
                                : profession === "medico"
                                  ? "#00C9A7"
                                  : profession === "engenheiro"
                                    ? "#2EBD59"
                                    : profession === "empresario"
                                      ? "#FFD700"
                                      : "#808080",
                          }}
                        >
                          {profession}
                        </Badge>
                      </div>

                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal m-0 transition-colors duration-300 text-sm">
                        "{text}"
                      </p>

                      {/* XP e Nível */}
                      {xp && nivel && (
                        <div className="flex items-center gap-2 mt-4 text-xs">
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#4D7CFF]/10 text-[#4D7CFF]">
                            <Sparkles className="size-3" />
                            {xp}
                          </span>
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#00C9A7]/10 text-[#00C9A7]">
                            <Star className="size-3" />
                            Nv.{nivel}
                          </span>
                        </div>
                      )}

                      <footer className="flex items-center gap-3 mt-4">
                        <img
                          width={48}
                          height={48}
                          src={image}
                          alt={`Avatar de ${name}`}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800 group-hover:ring-[#4D7CFF]/30 transition-all duration-300 ease-in-out"
                        />
                        <div className="flex flex-col">
                          <cite className="font-semibold not-italic tracking-tight leading-5 text-neutral-900 dark:text-white transition-colors duration-300">
                            {name}
                          </cite>
                          <span className="text-sm leading-5 tracking-tight text-neutral-500 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
                            {role}
                          </span>
                        </div>
                      </footer>
                    </blockquote>
                  </motion.li>
                ),
              )}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-transparent py-24 relative overflow-hidden"
    >
      {/* Gradientes de fundo */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

      {/* Elementos decorativos */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-[#4D7CFF]/5 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-[#00C9A7]/5 blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 },
        }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-16">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
            >
              <Sparkles className="size-4" />
              <span>Depoimentos</span>
            </Badge>
          </div>

          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-center text-neutral-900 dark:text-white transition-colors"
          >
            Feito para{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Todos
            </span>
            .
          </h2>
          <p className="text-center mt-5 text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed max-w-md transition-colors">
            Profissionais de diversas áreas já transformaram suas rotinas com o
            Nucleos.
          </p>
        </div>

        <div
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
          role="region"
          aria-label="Depoimentos em Rolagem"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={30}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={28}
          />
        </div>
      </motion.div>
    </section>
  );
};

// --- Main App Component ---
export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="w-screen min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 flex flex-col justify-center relative selection:bg-[#4D7CFF] selection:text-white">
      {/* Dark Mode Toggle */}

      <TestimonialsSection />
    </div>
  );
}
