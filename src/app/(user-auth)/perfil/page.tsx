"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Camera, Save } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import { useCurrentUser } from "@/hooks/useDashboard";
import { useUpdatePerfil } from "@/hooks/usePerfil";
import type { UpdateUserPayload } from "@/src/types/test";

export default function PerfilPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const updatePerfil = useUpdatePerfil();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setNome(user.nome ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const initials = user?.nome
    ? user.nome
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  function handleSave() {
    const payload: UpdateUserPayload = {
      nome,
      email,
    };

    updatePerfil.mutate(payload);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">Meu Perfil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 space-y-6">

        {/* Avatar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {isLoading ? (
                  <Skeleton className="h-16 w-16 rounded-full" />
                ) : (
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatarUrl ?? ""} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <button
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow"
                  aria-label="Alterar foto"
                >
                  <Camera className="h-3 w-3 text-primary-foreground" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-foreground truncate">
                      {user?.nome ?? "—"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user?.email ?? "—"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Membro desde{" "}
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados pessoais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Nome completo
              </Label>
              {isLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="h-9"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                E-mail
              </Label>
              {isLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  type="email"
                  className="h-9"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Salvar */}
        <div className="flex justify-end">
          <Button
            className="gap-2"
            onClick={handleSave}
            disabled={updatePerfil.isPending || isLoading}
          >
            <Save className="h-4 w-4" />
            {updatePerfil.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>

      </main>
    </div>
  );
}