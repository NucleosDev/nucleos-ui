"use client";

import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Brain,
  Dumbbell,
  Briefcase,
  Trophy,
  Target,
  Users,
  Rocket,
  Heart,
  Wallet,
} from "lucide-react";

const nucleosData = [
  {
    nome: "Estudos",
    nivel: 12,
    progresso: 82,
    icon: Brain,
  },
  {
    nome: "Fitness",
    nivel: 8,
    progresso: 60,
    icon: Dumbbell,
  },
  {
    nome: "Trabalho",
    nivel: 15,
    progresso: 90,
    icon: Briefcase,
  },
  {
    nome: "Finanças",
    nivel: 98,
    progresso: 12,
    icon: Wallet,
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-20">
      {/* HERO */}
      <section className="text-center space-y-6">
        <Badge>Nucleos</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">
          Evolua sua vida como um jogo
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          O Nucleos é uma plataforma que transforma sua rotina em um sistema de
          progresso contínuo. Aqui, você evolui em áreas importantes da sua vida
          como se estivesse subindo de nível em um game.
        </p>
        <div className="grid gap-6 md:grid-cols-3 justify-items-center">
          <Link href="/planos"></Link>
          <Link href="/docs">
            <Button variant="outline">Ver documentação</Button>
          </Link>
        </div>
      </section>

      {/* MISSÃO */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 space-y-3">
            <Target className="w-8 h-8" />
            <h3 className="text-xl font-semibold">Missão</h3>
            <p className="text-sm text-muted-foreground">
              Ajudar pessoas a evoluírem de forma consistente, criando hábitos e
              acompanhando progresso de forma clara e motivadora.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <Rocket className="w-8 h-8" />
            <h3 className="text-xl font-semibold">Visão</h3>
            <p className="text-sm text-muted-foreground">
              Ser a principal plataforma de evolução pessoal baseada em
              gamificação no Brasil.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <Heart className="w-8 h-8" />
            <h3 className="text-xl font-semibold">Valores</h3>
            <p className="text-sm text-muted-foreground">
              Disciplina, consistência, evolução contínua e foco no crescimento
              pessoal real.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* COMO FUNCIONA */}
      <section className="space-y-10">
        <h2 className="text-3xl font-bold text-center">
          Como funciona o Nucleos
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {nucleosData.map((nucleo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <nucleo.icon className="w-8 h-8" />
                  <h3 className="text-lg font-semibold">{nucleo.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    Nível {nucleo.nivel}
                  </p>
                  <Progress value={nucleo.progresso} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="space-y-10">
        <h2 className="text-3xl font-bold text-center">
          Por que usar o Nucleos?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              <Trophy className="w-8 h-8" />
              <h3 className="font-semibold">Gamificação real</h3>
              <p className="text-sm text-muted-foreground">
                Transforme tarefas do dia a dia em conquistas e níveis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Users className="w-8 h-8" />
              <h3 className="font-semibold">Evolução contínua</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe seu progresso de forma clara e motivadora.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Target className="w-8 h-8" />
              <h3 className="font-semibold">Foco total</h3>
              <p className="text-sm text-muted-foreground">
                Organize sua vida em áreas importantes e evolua cada uma delas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="space-y-10 text-center">
        <h2 className="text-3xl font-bold">Criado por</h2>

        <div className="grid gap-6 md:grid-cols-3 justify-items-center ">
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4 flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">Andrew Pimenta</h3>
              <p className="text-sm text-muted-foreground text-center">
                Engenheiro de software focado em soluções escaláveis ​​e impacto
                significativo.
              </p>

              <div className="flex gap-3 mt-2">
                <Link
                  href="https://github.com/andrewLpimenta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
                <Link
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2 */}
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4 flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">Alisson Alves</h3>
              <p className="text-sm text-muted-foreground text-center">
                Designer focado em criar interfaces modernas e intuitivas para
                melhorar a experiência do usuário.
              </p>

              <div className="flex gap-3 mt-2">
                <Link
                  href="https://github.com/alissinrlk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
                <Link
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3 */}
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4 flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarFallback>CA</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">Cauê Alves</h3>
              <p className="text-sm text-muted-foreground text-center">
                Especialista em UX, focada em transformar ideias em experiências
                digitais eficientes.
              </p>

              <div className="flex gap-3 mt-2">
                <Link
                  href="https://github.com/caueffc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/cau%C3%AA-alves-ab17a02a7/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4 */}
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4 flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">João Pedro</h3>
              <p className="text-sm text-muted-foreground text-center">
                Desenvolvedor focado em performance e escalabilidade de
                aplicações web.
              </p>

              <div className="flex gap-3 mt-2">
                <Link
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
                <Link
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* CARD 5 */}
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4 flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarFallback>KA</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">Kevynn M Alves</h3>
              <p className="text-sm text-muted-foreground text-center">
                WEB Developer apaixonado por criar experiências digitais
                modernas e funcionais.
              </p>
              <div className="flex gap-3 mt-2">
                <Link
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
                <Link
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* CARD 6 */}
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4 flex flex-col items-center">
              <Avatar className="w-20 h-20">
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">Matheus Tavares</h3>
              <p className="text-sm text-muted-foreground text-center">
                Analista de produto dedicada a melhorar funcionalidades e
                métricas do sistema.
              </p>

              <div className="flex gap-3 mt-2">
                <Link
                  href="https://github.com/MatheusFTavares]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/matheus-tavares-8aa9502b5?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 hover:text-primary hover:scale-110 transition" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Pronto para evoluir?</h2>
        <p className="text-muted-foreground">
          Comece agora e transforme sua rotina em progresso.
        </p>
        <Link href="/planos">
          <Button size="lg">Começar gratuitamente</Button>
        </Link>
      </section>
    </div>
  );
}
