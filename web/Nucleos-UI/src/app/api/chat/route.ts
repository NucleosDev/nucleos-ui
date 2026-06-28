import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatContext {
  user?: {
    fullName?: string;
    email?: string;
  };
  nucleos?: Array<{
    nome: string;
    tipo: string;
  }>;
  streak?: {
    currentStreak: number;
    longestStreak: number;
  };
  stats?: {
    xpTotal: number;
    level: number;
    xpHoje: number;
  };
}

function buildSystemPrompt(context: ChatContext): string {
  const date = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines: string[] = [
    "Você é o NucleosIA, assistente de produtividade do app Nucleos.",
    `Data atual: ${date}`,
    "",
  ];

  if (context.user?.fullName) {
    lines.push(`Usuário: ${context.user.fullName}`);
  }

  if (context.nucleos && context.nucleos.length > 0) {
    lines.push(`\nEspaços de trabalho (Nucleos) do usuário:`);
    context.nucleos.forEach((n) => {
      lines.push(`• ${n.nome} (${n.tipo})`);
    });
  } else {
    lines.push("\nO usuário ainda não criou nenhum Nucleo.");
  }

  if (context.streak) {
    lines.push(
      `\nSequência de uso: ${context.streak.currentStreak} dia(s) consecutivos (recorde: ${context.streak.longestStreak} dias)`
    );
  }

  if (context.stats) {
    lines.push(
      `Progresso: Nível ${context.stats.level} | ${context.stats.xpTotal} XP total | ${context.stats.xpHoje} XP hoje`
    );
  }

  lines.push(
    "\nResponda sempre em português brasileiro de forma concisa e direta.",
    "Se perguntarem sobre tarefas ou eventos específicos que você não tem dados, diga isso brevemente e oriente onde encontrar no app.",
    "Nunca invente dados do usuário."
  );

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "HF_TOKEN não configurado no servidor." },
      { status: 500 }
    );
  }

  let body: { messages: ChatMessage[]; context?: ChatContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const { messages, context = {} } = body;

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: "Nenhuma mensagem enviada." },
      { status: 400 }
    );
  }

  const systemPrompt = buildSystemPrompt(context);

  const hfMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.slice(-10),
  ];

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.3",
          messages: hfMessages,
          max_tokens: 512,
          temperature: 0.7,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("HF API error:", err);
      return NextResponse.json(
        { error: "Erro ao chamar o modelo de IA." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ??
      "Não consegui gerar uma resposta. Tente novamente.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
