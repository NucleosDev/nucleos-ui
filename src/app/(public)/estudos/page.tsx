"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Calendar, 
  Target, 
  Brain, 
  Clock, 
  BarChart3, 
  Trophy, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Layers,
  Play,
  Star,
  TrendingUp,
  Flame,
  GraduationCap,
  PenTool,
  BookMarked,
  Timer,
  LineChart,
  Award
} from "lucide-react"
import { useState } from "react"

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <span className="tabular-nums">{value}{suffix}</span>
  )
}

function BentoCard({ 
  children, 
  className = "",
  hover = true
}: { 
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div className={`group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 ${hover ? "hover:border-primary/30 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1" : ""} ${className}`}>
      {children}
    </div>
  )
}

function ProgressRing({ progress, size = 60, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted/30"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-foreground">{progress}%</span>
      </div>
    </div>
  )
}

function SubjectCard({ 
  title, 
  icon: Icon, 
  level, 
  xp, 
  progress,
  color,
  streak
}: { 
  title: string
  icon: React.ElementType
  level: number
  xp: string
  progress: number
  color: string
  streak: number
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          <span className="text-xs font-medium text-orange-500">{streak}d</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Nível {level}</span>
        <span className="text-border">•</span>
        <span>{xp} XP</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function EstudosPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Layers,
      title: "Nucleos Personalizados",
      description: "Crie espaços únicos para cada matéria com temas, cores e configurações próprias."
    },
    {
      icon: Calendar,
      title: "Cronograma Inteligente",
      description: "Sistema de agendamento com repetição espaçada baseado em algoritmos científicos."
    },
    {
      icon: Brain,
      title: "Revisão Adaptativa",
      description: "IA que identifica pontos fracos e ajusta automaticamente seu plano de estudos."
    },
    {
      icon: LineChart,
      title: "Analytics Avançado",
      description: "Métricas detalhadas sobre tempo, foco, retenção e evolução ao longo do tempo."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-foreground font-medium">Para Estudos</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                  Novo
                </Badge>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                <span className="block text-muted-foreground/60 text-3xl sm:text-4xl md:text-5xl font-medium mb-2">
                  Organize suas matérias.
                </span>
                Evolua seus{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">estudos</span>
                  <span className="absolute bottom-2 left-0 right-0 h-4 bg-primary/20 -rotate-1 rounded" />
                </span>.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
                Crie Nucleos para cada disciplina, acompanhe seu progresso em tempo real 
                e transforme o aprendizado em uma experiência gamificada e envolvente.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2 group">
                Começar a estudar 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link href="/estudos/demo">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base gap-2 bg-background/50 backdrop-blur-sm">
                  <Play className="h-4 w-4" />
                  Ver demonstração
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    <AnimatedCounter value="47" suffix="%" />
                  </p>
                  <p className="text-sm text-muted-foreground">Mais produtividade</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    <AnimatedCounter value="2.5" suffix="x" />
                  </p>
                  <p className="text-sm text-muted-foreground">Mais consistência</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    <AnimatedCounter value="12K" suffix="+" />
                  </p>
                  <p className="text-sm text-muted-foreground">Estudantes ativos</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    <AnimatedCounter value="21" suffix="d" />
                  </p>
                  <p className="text-sm text-muted-foreground">Média de streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">Funcionalidades</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Tudo que você precisa para{" "}
              <span className="text-primary">estudar melhor</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ferramentas poderosas projetadas para maximizar seu aprendizado.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Large Feature Card */}
            <BentoCard className="md:col-span-2 md:row-span-2 p-8">
              <div className="h-full flex flex-col">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground mb-6 shadow-lg shadow-primary/25">
                  <Layers className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Nucleos por Matéria</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Crie um Nucleo dedicado para cada disciplina. Matemática, Física, Programação, Idiomas - 
                  cada área com seu próprio espaço, configurações e progresso independente.
                </p>
                
                {/* Mini Preview */}
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <BookMarked className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-foreground text-sm">Matemática</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-blue-500/20 overflow-hidden">
                      <div className="h-full w-3/4 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <PenTool className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-foreground text-sm">Redação</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-emerald-500/20 overflow-hidden">
                      <div className="h-full w-1/2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Timer Card */}
            <BentoCard className="p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <ProgressRing progress={75} size={80} strokeWidth={8} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Pomodoro Timer</h3>
              <p className="text-sm text-muted-foreground">Foco maximizado</p>
            </BentoCard>

            {/* Streak Card */}
            <BentoCard className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
              <div className="flex items-center justify-between mb-4">
                <Flame className="h-8 w-8 text-orange-500" />
                <span className="text-3xl font-bold text-orange-500">21</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Streak Atual</h3>
              <p className="text-sm text-muted-foreground">Dias consecutivos</p>
            </BentoCard>

            {/* Calendar Card */}
            <BentoCard className="p-6">
              <Calendar className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1">Cronograma</h3>
              <p className="text-sm text-muted-foreground">Organize sua rotina de estudos com lembretes automáticos</p>
            </BentoCard>

            {/* Brain Card */}
            <BentoCard className="p-6">
              <Brain className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1">Revisão Espaçada</h3>
              <p className="text-sm text-muted-foreground">Algoritmo científico para retenção máxima</p>
            </BentoCard>

            {/* Analytics Card - Wide */}
            <BentoCard className="md:col-span-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <BarChart3 className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Analytics Detalhado</h3>
                  <p className="text-sm text-muted-foreground">Gráficos e insights sobre seu desempenho</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+23%</span>
                </div>
              </div>
              
              {/* Mini Chart */}
              <div className="flex items-end gap-1 h-16">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                  <div 
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-300 hover:from-primary hover:to-primary/70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Subjects Demo Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <div>
              <Badge variant="outline" className="mb-4">Seus Nucleos</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Cada matéria é um{" "}
                <span className="text-primary">universo</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Organize suas disciplinas em Nucleos independentes. Cada tarefa concluída é XP, 
                cada dia de estudo fortalece seu streak. Transforme sua rotina em uma jornada épica.
              </p>
              
              {/* Feature List */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                      activeFeature === index 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 transition-colors ${
                      activeFeature === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-medium transition-colors ${
                        activeFeature === index ? "text-primary" : "text-foreground"
                      }`}>
                        {feature.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{feature.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Link href="">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/25 group">
                Criar meu primeiro Nucleo 
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>

              </Link>


            </div>











            
            {/* Subject Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <SubjectCard 
                title="Matemática"
                icon={BookMarked}
                level={14}
                xp="3.2K"
                progress={72}
                color="bg-blue-500"
                streak={7}
              />
              <SubjectCard 
                title="Programação"
                icon={PenTool}
                level={18}
                xp="4.8K"
                progress={85}
                color="bg-emerald-500"
                streak={12}
              />
              <SubjectCard 
                title="Física"
                icon={Target}
                level={9}
                xp="1.5K"
                progress={45}
                color="bg-purple-500"
                streak={5}
              />
              <SubjectCard 
                title="Inglês"
                icon={GraduationCap}
                level={11}
                xp="2.1K"
                progress={63}
                color="bg-orange-500"
                streak={21}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">Conquistas</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Desbloqueie{" "}
              <span className="text-primary">conquistas épicas</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Cada marco na sua jornada de estudos merece ser celebrado.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/25 transition-transform group-hover:scale-110">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Primeiro 10</p>
              <p className="text-xs text-muted-foreground mt-1">Nota máxima na prova</p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/25 transition-transform group-hover:scale-110">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Maratonista</p>
              <p className="text-xs text-muted-foreground mt-1">8h de estudo em um dia</p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-110">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Memória de Elefante</p>
              <p className="text-xs text-muted-foreground mt-1">30 revisões concluídas</p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 3 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-110">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Resumidor</p>
              <p className="text-xs text-muted-foreground mt-1">50 resumos criados</p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-8">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para transformar seus{" "}
              <span className="text-primary">estudos</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se a milhares de estudantes que já estão evoluindo com gamificação. 
              Comece grátis e desbloqueie seu potencial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2">
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm">
                Ver planos
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Grátis para começar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}