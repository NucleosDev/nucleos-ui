// "use client";

// import { useState } from "react";
// import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   timestamp: Date;
// }

// export default function ChatAIPage() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "welcome",
//       role: "assistant",
//       content:
//         "Olá! Sou seu assistente do Nucleos. Como posso ajudar você hoje? Posso sugerir tarefas, ajudar com organização ou dar dicas de produtividade.",
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       content: input,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     // Simulação de resposta da AI
//     setTimeout(() => {
//       const aiResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: generateAIResponse(input),
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, aiResponse]);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const generateAIResponse = (userInput: string): string => {
//     const input = userInput.toLowerCase();

//     if (input.includes("tarefa") || input.includes("organizar")) {
//       return "Que tal criar um novo Nucleo para organizar suas tarefas? Você pode categorizar por 'Trabalho', 'Pessoal' ou 'Estudos'. Posso te ajudar a estruturar isso!";
//     }
//     if (input.includes("hábito") || input.includes("rotina")) {
//       return "Para criar um novo hábito, sugiro começar pequeno. Por exemplo, 5 minutos por dia. O sistema de streak do Nucleos vai te motivar a manter a consistência!";
//     }
//     if (input.includes("xp") || input.includes("nível")) {
//       return "Você ganha XP completando tarefas e mantendo streaks. Cada tarefa fácil dá 10 XP, média 25 XP e difícil 50 XP. Continue evoluindo! 🚀";
//     }

//     return "Interessante! Pode me dar mais detalhes? Estou aqui para ajudar com organização, produtividade e qualquer dúvida sobre o Nucleos.";
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex h-[calc(100vh-4rem)] flex-col">
//       {/* Header */}
//       <header className="border-b border-border bg-background/80 backdrop-blur-md p-4">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//             <Bot className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-lg font-semibold">Assistente AI</h1>
//             <p className="text-xs text-muted-foreground">
//               Tire dúvidas sobre produtividade e organização
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Área de mensagens */}
//       <ScrollArea className="flex-1 p-4">
//         <div className="space-y-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex gap-3 ${
//                 message.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               {message.role === "assistant" && (
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="bg-primary/10">
//                     <Bot className="h-4 w-4 text-primary" />
//                   </AvatarFallback>
//                 </Avatar>
//               )}

//               <Card
//                 className={`max-w-[80%] p-3 ${
//                   message.role === "user"
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-muted"
//                 }`}
//               >
//                 <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//                 <span className="mt-1 block text-right text-[10px] opacity-70">
//                   {message.timestamp.toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </span>
//               </Card>

//               {message.role === "user" && (
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="bg-secondary">
//                     <User className="h-4 w-4" />
//                   </AvatarFallback>
//                 </Avatar>
//               )}
//             </div>
//           ))}

//           {isLoading && (
//             <div className="flex justify-start gap-3">
//               <Avatar className="h-8 w-8">
//                 <AvatarFallback className="bg-primary/10">
//                   <Bot className="h-4 w-4 text-primary" />
//                 </AvatarFallback>
//               </Avatar>
//               <Card className="bg-muted p-3">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               </Card>
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       {/* Input de mensagem */}
//       <footer className="border-t border-border p-4">
//         <div className="flex gap-2">
//           <Input
//             placeholder="Digite sua mensagem..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//             disabled={isLoading}
//             className="flex-1"
//           />
//           <Button
//             onClick={handleSendMessage}
//             disabled={!input.trim() || isLoading}
//             className="gap-2"
//           >
//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <>
//                 <Send className="h-4 w-4" />
//                 Enviar
//               </>
//             )}
//           </Button>
//         </div>
//         <p className="mt-2 text-center text-xs text-muted-foreground">
//           <Sparkles className="inline h-3 w-3 mr-1" />
//           Assistente AI pode cometer erros. Verifique informações importantes.
//         </p>
//       </footer>
//     </div>
//   );
// }

import { BoltStyleChat } from "@/components/ui/bolt-style-chat";

export default function DemoOne() {
  return <BoltStyleChat />;
}
