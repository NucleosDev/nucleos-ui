// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   User,
//   Mail,
//   Shield,
//   Zap,
//   Flame,
//   Trophy,
//   LogOut,
// } from "lucide-react";
// import { useAuth } from "@/auth";
// import { useGamificacao } from "@/hooks/useGamificacao";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/hooks/use-toast";
// import { Separator } from "@/components/ui/separator";
// import {} from "@/components/layout-auth/profile-url";

// export default function PerfilPage() {
//   const router = useRouter();
//   const { user, logout, updateUserProfile } = useAuth();
//   const { level, currentStreak, conquistas } = useGamificacao();
//   const [editando, setEditando] = useState(false);
//   const [nome, setNome] = useState(user?.fullName || "");
//   const [salvando, setSalvando] = useState(false);

//   // Dados do usuário
//   const fullName = user?.fullName || "";
//   const email = user?.email || "";
//   const avatarUrl = user?.profile?.avatarUrl || user?.avatarUrl || "";
//   const initials = fullName
//     .split(" ")
//     .map((n) => n[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   const xpPct = level
//     ? Math.min(Math.round((level.currentXp / level.nextLevelXp) * 100), 100)
//     : 0;

//   const salvar = async () => {
//     if (!nome.trim()) {
//       toast({ title: "Nome não pode estar vazio", variant: "destructive" });
//       return;
//     }

//     setSalvando(true);
//     try {
//       await updateUserProfile?.({ fullName: nome });
//       toast({ title: "Perfil atualizado!" });
//       setEditando(false);
//     } catch (error) {
//       toast({
//         title: "Erro",
//         description: "Falha ao atualizar o perfil.",
//         variant: "destructive",
//       });
//     } finally {
//       setSalvando(false);
//     }
//   };

//   const handleImageUrlChange = async (imageUrl: string) => {
//     await updateUserProfile?.({ profileImage: imageUrl });
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push("/entrar");
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
//           <Button variant="ghost" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <span className="font-semibold">Meu Perfil</span>
//         </div>
//       </header>

//       <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
//         {/* Avatar + nome com input de URL */}
//         <div className="flex flex-col items-center gap-4 py-4">
//           <ProfileImageUrlInput
//             currentImageUrl={avatarUrl}
//             userInitials={initials}
//             userName={fullName}
//             onImageUrlChange={handleImageUrlChange}
//           />
//           <div className="text-center">
//             <h1 className="text-xl font-bold">{fullName}</h1>
//             <p className="text-sm text-muted-foreground">{email}</p>
//           </div>
//           <div className="flex gap-2">
//             <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
//               <Zap className="w-3.5 h-3.5 text-yellow-500" />
//               <span className="text-xs font-semibold">
//                 Nível {level?.level ?? 1}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
//               <Flame className="w-3.5 h-3.5 text-orange-500" />
//               <span className="text-xs font-semibold">
//                 {currentStreak} dias
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
//               <Trophy className="w-3.5 h-3.5 text-yellow-500" />
//               <span className="text-xs font-semibold">
//                 {conquistas?.length ?? 0}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* XP Progress */}
//         <Card>
//           <CardContent className="pt-4">
//             <div className="flex justify-between text-sm mb-2">
//               <span className="font-medium">
//                 Progresso — Nível {level?.level ?? 1}
//               </span>
//               <span className="text-muted-foreground">
//                 {level?.currentXp ?? 0}/{level?.nextLevelXp ?? 100} XP
//               </span>
//             </div>
//             <Progress value={xpPct} className="h-2.5" />
//             <p className="text-xs text-muted-foreground mt-2">
//               Total ganho: {(level?.totalXpEarned ?? 0).toLocaleString("pt-BR")}{" "}
//               XP
//             </p>
//           </CardContent>
//         </Card>

//         {/* Informações Pessoais */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base flex items-center gap-2">
//               <User className="w-4 h-4 text-primary" />
//               Informações Pessoais
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {editando ? (
//               <>
//                 <div>
//                   <label className="text-xs font-medium text-muted-foreground block mb-1">
//                     Nome completo
//                   </label>
//                   <Input
//                     value={nome}
//                     onChange={(e) => setNome(e.target.value)}
//                     placeholder="Seu nome completo"
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <Button onClick={salvar} disabled={salvando} size="sm">
//                     {salvando ? "Salvando..." : "Salvar"}
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setEditando(false);
//                       setNome(fullName);
//                     }}
//                   >
//                     Cancelar
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <User className="w-4 h-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-xs text-muted-foreground">Nome</p>
//                     <p className="text-sm font-medium">{fullName}</p>
//                   </div>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center gap-3">
//                   <Mail className="w-4 h-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-xs text-muted-foreground">Email</p>
//                     <p className="text-sm font-medium">{email}</p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setEditando(true)}
//                   className="mt-2"
//                 >
//                   Editar informações
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Área da Conta */}
//         <Card className="border-destructive/20">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base flex items-center gap-2 text-destructive">
//               <Shield className="w-4 h-4" />
//               Conta
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Button
//               variant="destructive"
//               onClick={handleLogout}
//               className="w-full"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Sair da conta
//             </Button>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }
