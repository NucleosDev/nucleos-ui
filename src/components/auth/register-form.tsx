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

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cpf: "",
    nickname: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.cpf
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Validação simples de CPF (apenas caracteres)
    const cpfClean = formData.cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      setError("CPF inválido");
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
        phone: formData.phone, // Pode ser vazio, mas será enviado
        Cpf: cpfClean,
        nickname: formData.nickname || undefined,
      });
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Erro ao registrar";
      setError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para se cadastrar
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
            <Label htmlFor="fullName">Nome completo *</Label>
            <Input
              id="fullName"
              placeholder="Seu nome completo"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">Apelido</Label>
            <Input
              id="nickname"
              placeholder="Como quer ser chamado(a)"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              disabled={isLoading}
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
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Já tem uma conta?{" "}
            <a href="/entrar" className="text-primary hover:underline">
              Faça login
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
