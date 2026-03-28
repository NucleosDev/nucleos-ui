"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Heart, 
  ChevronLeft, 
  Plus, 
  Droplets, 
  Moon, 
  Footprints,
  Activity,
  Apple,
  Dumbbell,
  Target,
  Trophy,
  Flame,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Zap,
  Award,
  Settings,
  Bell,
  Search,
  MoreHorizontal,
  Play,
  CheckCircle2,
  Circle,
  ChevronRight,
  Sparkles,
  Scale,
  Bike,
  Timer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const healthMetrics = [
  { 
    id: 1, 
    name: "Passos", 
    icon: Footprints,
    value: 8432,
    goal: 10000,
    unit: "passos",
    color: "from-emerald-500 to-teal-500",
    trend: "+12%"
  },
  { 
    id: 2, 
    name: "Água", 
    icon: Droplets,
    value: 6,
    goal: 8,
    unit: "copos",
    color: "from-blue-500 to-cyan-500",
    trend: "+2"
  },
  { 
    id: 3, 
    name: "Sono", 
    icon: Moon,
    value: 7.5,
    goal: 8,
    unit: "horas",
    color: "from-purple-500 to-pink-500",
    trend: "-0.5h"
  },
  { 
    id: 4, 
    name: "Calorias", 
    icon: Flame,
    value: 1850,
    goal: 2000,
    unit: "kcal",
    color: "from-orange-500 to-red-500",
    trend: "+150"
  },
]

const workouts = [
  { id: 1, name: "Corrida Matinal", type: "Cardio", duration: "30 min", calories: 320, completed: true, icon: Footprints },
  { id: 2, name: "Treino de Força", type: "Musculação", duration: "45 min", calories: 280, completed: true, icon: Dumbbell },
  { id: 3, name: "Yoga", type: "Flexibilidade", duration: "20 min", calories: 100, completed: false, icon: Activity },
  { id: 4, name: "Ciclismo", type: "Cardio", duration: "40 min", calories: 400, completed: false, icon: Bike },
]

const meals = [
  { id: 1, name: "Café da Manhã", time: "07:30", calories: 450, logged: true, items: ["Ovos", "Pão Integral", "Frutas"] },
  { id: 2, name: "Almoço", time: "12:30", calories: 650, logged: true, items: ["Frango", "Arroz", "Salada"] },
  { id: 3, name: "Lanche", time: "16:00", calories: 200, logged: true, items: ["Iogurte", "Granola"] },
  { id: 4, name: "Jantar", time: "19:30", calories: 0, logged: false, items: [] },
]

const achievements = [
  { id: 1, name: "7 Dias Ativos", icon: Flame, unlocked: true, color: "text-orange-400" },
  { id: 2, name: "Hidratado", icon: Droplets, unlocked: true, color: "text-blue-400" },
  { id: 3, name: "Madrugador", icon: Moon, unlocked: true, color: "text-purple-400" },
  { id: 4, name: "50km Corridos", icon: Footprints, unlocked: false, color: "text-emerald-400" },
]

const weeklyData = [
  { day: "Seg", steps: 9500, calories: 2100, sleep: 7 },
  { day: "Ter", steps: 8200, calories: 1950, sleep: 7.5 },
  { day: "Qua", steps: 11000, calories: 2300, sleep: 6.5 },
  { day: "Qui", steps: 7800, calories: 1800, sleep: 8 },
  { day: "Sex", steps: 9000, calories: 2000, sleep: 7 },
  { day: "Sáb", steps: 5500, calories: 2200, sleep: 8.5 },
  { day: "Dom", steps: 8432, calories: 1850, sleep: 7.5 },
]

export default function SaudeDemoPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "workouts" | "nutrition" | "stats">("dashboard")
  const [waterCount, setWaterCount] = useState(6)
  const [workoutList, setWorkoutList] = useState(workouts)

  const toggleWorkout = (id: number) => {
    setWorkoutList(workoutList.map(w => w.id === id ? { ...w, completed: !w.completed } : w))
  }

  const totalCaloriesBurned = workoutList.filter(w => w.completed).reduce((acc, w) => acc + w.calories, 0)
  const totalMealsLogged = meals.filter(m => m.logged).length

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Modo Demonstração</span>
            <span className="text-white/80 text-sm hidden sm:inline">- Explore todas as funcionalidades do Nucleos para Saúde</span>
          </div>
          <Link href="/saude">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-52px)] hidden lg:block">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Saúde</h2>
                <p className="text-xs text-muted-foreground">Bem-estar completo</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === "dashboard" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("workouts")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === "workouts" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm font-medium">Treinos</span>
              </button>
              <button
                onClick={() => setActiveTab("nutrition")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === "nutrition" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Apple className="w-4 h-4" />
                <span className="text-sm font-medium">Nutrição</span>
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === "stats" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Estatísticas</span>
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Metas Diárias</h3>
              <div className="space-y-3">
                {healthMetrics.slice(0, 3).map((metric) => (
                  <div key={metric.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <span className="text-foreground font-medium">
                        {metric.value}/{metric.goal}
                      </span>
                    </div>
                    <Progress value={(metric.value / metric.goal) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Water Tracker */}
          <div className="mx-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Água</span>
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(8)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWaterCount(i + 1)}
                    className={`w-6 h-8 rounded transition-all ${
                      i < waterCount 
                        ? "bg-blue-500" 
                        : "bg-muted hover:bg-blue-500/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">{waterCount}/8 copos</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {activeTab === "dashboard" && "Dashboard de Saúde"}
                {activeTab === "workouts" && "Treinos"}
                {activeTab === "nutrition" && "Nutrição"}
                {activeTab === "stats" && "Estatísticas"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {activeTab === "dashboard" && "Acompanhe suas métricas de bem-estar"}
                {activeTab === "workouts" && `${workoutList.filter(w => w.completed).length} de ${workoutList.length} treinos concluídos`}
                {activeTab === "nutrition" && `${totalMealsLogged} de ${meals.length} refeições registradas`}
                {activeTab === "stats" && "Visualize seu progresso ao longo do tempo"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9 w-64 bg-background" />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {healthMetrics.map((metric) => {
                  const percentage = (metric.value / metric.goal) * 100
                  const isPositive = metric.trend.startsWith("+")
                  return (
                    <div 
                      key={metric.id}
                      className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                          <metric.icon className="w-5 h-5 text-white" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
                        >
                          {metric.trend}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-foreground">
                          {metric.value.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
                        </p>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{metric.name}</span>
                            <span className="text-foreground">{Math.round(percentage)}%</span>
                          </div>
                          <Progress value={percentage} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Today's Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Workouts */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Treinos de Hoje</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {totalCaloriesBurned} kcal
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {workoutList.slice(0, 3).map((workout) => (
                      <div 
                        key={workout.id}
                        className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                          workout.completed 
                            ? "bg-emerald-500/5 border-emerald-500/20" 
                            : "bg-background border-border hover:border-primary/50"
                        }`}
                      >
                        <button onClick={() => toggleWorkout(workout.id)}>
                          {workout.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                          )}
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                          <workout.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-foreground ${workout.completed ? "line-through opacity-60" : ""}`}>
                            {workout.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{workout.type} - {workout.duration}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{workout.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Treino
                  </Button>
                </div>

                {/* Meals */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Refeições</h3>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                      {meals.filter(m => m.logged).reduce((acc, m) => acc + m.calories, 0)} kcal
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div 
                        key={meal.id}
                        className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                          meal.logged 
                            ? "bg-emerald-500/5 border-emerald-500/20" 
                            : "bg-background border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                          <Apple className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{meal.name}</p>
                            <span className="text-xs text-muted-foreground">{meal.time}</span>
                          </div>
                          {meal.logged ? (
                            <p className="text-xs text-muted-foreground">{meal.items.join(", ")}</p>
                          ) : (
                            <p className="text-xs text-amber-500">Não registrado</p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {meal.logged ? `${meal.calories} kcal` : "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Workouts Tab */}
          {activeTab === "workouts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                    {workoutList.filter(w => w.completed).length} concluídos
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                    {totalCaloriesBurned} kcal queimadas
                  </Badge>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Novo Treino
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {workoutList.map((workout) => (
                  <div 
                    key={workout.id}
                    className={`bg-card border rounded-xl p-5 transition-all ${
                      workout.completed 
                        ? "border-emerald-500/30 bg-emerald-500/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          workout.completed 
                            ? "bg-emerald-500/20" 
                            : "bg-accent"
                        }`}>
                          <workout.icon className={`w-6 h-6 ${workout.completed ? "text-emerald-500" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{workout.name}</h3>
                          <p className="text-sm text-muted-foreground">{workout.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{workout.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-foreground">{workout.calories} kcal</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      variant={workout.completed ? "secondary" : "default"}
                      onClick={() => toggleWorkout(workout.id)}
                    >
                      {workout.completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Concluído
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar Treino
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === "nutrition" && (
            <div className="space-y-6">
              {/* Calories Overview */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Resumo Calórico</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">1300</p>
                    <p className="text-sm text-muted-foreground">Consumidas</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-3xl font-bold text-primary">700</p>
                    <p className="text-sm text-muted-foreground">Restantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">2000</p>
                    <p className="text-sm text-muted-foreground">Meta Diária</p>
                  </div>
                </div>
                <Progress value={65} className="h-3 mt-4" />
              </div>

              {/* Meals List */}
              <div className="space-y-4">
                {meals.map((meal) => (
                  <div 
                    key={meal.id}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          meal.logged ? "bg-emerald-500/20" : "bg-accent"
                        }`}>
                          <Apple className={`w-5 h-5 ${meal.logged ? "text-emerald-500" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{meal.name}</h3>
                          <p className="text-sm text-muted-foreground">{meal.time}</p>
                        </div>
                      </div>
                      {meal.logged ? (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                          {meal.calories} kcal
                        </Badge>
                      ) : (
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Registrar
                        </Button>
                      )}
                    </div>
                    {meal.logged && (
                      <div className="flex flex-wrap gap-2">
                        {meal.items.map((item, i) => (
                          <Badge key={i} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Weekly Chart */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Passos da Semana</h3>
                <div className="flex items-end justify-between gap-2 h-48">
                  {weeklyData.map((day, i) => {
                    const maxSteps = Math.max(...weeklyData.map(d => d.steps))
                    const height = (day.steps / maxSteps) * 100
                    const isToday = i === weeklyData.length - 1
                    return (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs text-muted-foreground">{day.steps.toLocaleString()}</span>
                        <div 
                          className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                            isToday 
                              ? "bg-gradient-to-t from-emerald-500 to-teal-500" 
                              : "bg-gradient-to-t from-emerald-500/50 to-teal-500/50"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                        <span className={`text-xs ${isToday ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {day.day}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-4">Sono da Semana</h3>
                  <div className="space-y-3">
                    {weeklyData.map((day) => (
                      <div key={day.day} className="flex items-center gap-3">
                        <span className="w-8 text-sm text-muted-foreground">{day.day}</span>
                        <div className="flex-1 h-3 bg-accent rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${(day.sleep / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground w-10 text-right">{day.sleep}h</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-4">Conquistas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className={`p-3 rounded-lg border transition-all ${
                          achievement.unlocked 
                            ? "bg-accent/50 border-border" 
                            : "bg-muted/30 border-transparent opacity-50"
                        }`}
                      >
                        <achievement.icon className={`w-6 h-6 mb-2 ${achievement.color}`} />
                        <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
