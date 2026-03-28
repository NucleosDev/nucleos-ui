"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
// interface LoginFormProps {
//   callbackUrl?: string;
// }

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" }); // Use lowercase password para consistência

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Preencha todos os campos");
      console.warn("[FORM] Campos vazios");
      return;
    }

    console.log("[FORM] Tentando login com:", { email: formData.email });

    try {
      const response = await login({
        email: formData.email,
        Password: formData.password, // Certifique-se que o campo está correto
      });
      console.log("[FORM] Login bem-sucedido:", response);
      router.push(ROUTES.DASHBOARD);
    } catch (err: any) {
      console.error("[FORM] Erro no login:", err);
      // Log detalhado da resposta de erro
      if (err.response) {
        console.error("[FORM] Status:", err.response.status);
        console.error("[FORM] Data:", err.response.data);
        console.error("[FORM] Headers:", err.response.headers);
      } else if (err.request) {
        console.error("[FORM] Sem resposta do servidor:", err.request);
      } else {
        console.error("[FORM] Erro de configuração:", err.message);
      }

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "E-mail ou senha inválidos";
      setError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isLoading}
              className="transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              disabled={isLoading}
              className="transition-all"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 pb-2">
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
