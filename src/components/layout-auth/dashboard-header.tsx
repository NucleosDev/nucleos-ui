// "use client";

// import { Bell, Plus, Search, Settings, LogOut, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import Image from "next/image";

// export function DashboardHeader({
//   userName,
//   userEmail,
//   userAvatarUrl,
//   onNewNucleo,
//   onSearch,
// }: DashboardHeaderProps) {
//   const initials = userName
//     ? userName
//         .split(" ")
//         .slice(0, 2)
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//     : "U";

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
//       <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
//         {/* Logo */}
//         <div className="flex items-center gap-2 shrink-0">
//           <div className="flex h-7 w-7 items-center justify-center rounded-lg">
//             <Image src={"icon.svg"} height={30} width={40} alt="logo" />
//           </div>
//         </div>

//         {/* Busca */}
//         <div className="relative hidden max-w-xs flex-1 md:flex">
//           <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Buscar núcleos..."
//             className="h-8 pl-8 text-sm bg-muted border-transparent focus-visible:border-border focus-visible:bg-background"
//             onChange={(e) => onSearch?.(e.target.value)}
//           />
//         </div>

//         {/* Ações */}
//         <div className="flex items-center gap-1.5">
//           <Button
//             size="sm"
//             className="hidden h-8 gap-1.5 text-xs sm:flex"
//             onClick={onNewNucleo}
//           >
//             <Plus className="h-3.5 w-3.5" />
//             Novo Núcleo
//           </Button>

//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 text-muted-foreground hover:text-foreground"
//             aria-label="Notificações"
//           >
//             <Bell className="h-4 w-4" />
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button
//                 className="rounded-full ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//                 aria-label="Menu do usuário"
//               >
//                 <Avatar className="h-7 w-7">
//                   <AvatarImage
//                     src={userAvatarUrl ?? undefined}
//                     alt={userName ?? "Usuário"}
//                   />
//                   <AvatarFallback className="text-xs bg-primary text-primary-foreground">
//                     {initials}
//                   </AvatarFallback>
//                 </Avatar>
//               </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuLabel className="font-normal">
//                 <p className="text-sm font-medium leading-none">
//                   {userName ?? "Usuário"}
//                 </p>
//                 {userEmail && (
//                   <p className="mt-1 text-xs text-muted-foreground">
//                     {userEmail}
//                   </p>
//                 )}
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <User className="mr-2 h-3.5 w-3.5" />
//                 Perfil
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Settings className="mr-2 h-3.5 w-3.5" />
//                 Configurações
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="text-destructive focus:text-destructive">
//                 <LogOut className="mr-2 h-3.5 w-3.5" />
//                 Sair
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   );
// }
