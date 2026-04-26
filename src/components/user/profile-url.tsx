// src/components/profile-image-url-input.tsx
"use client";

import { useState } from "react";
import { Image, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface ProfileImageUrlInputProps {
  currentImageUrl: string;
  userInitials: string;
  userName: string;
  onImageUrlChange: (imageUrl: string) => Promise<void>;
}

export function ProfileImageUrlInput({
  currentImageUrl,
  userInitials,
  userName,
  onImageUrlChange,
}: ProfileImageUrlInputProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(currentImageUrl);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!url.trim()) {
      toast({ title: "URL inválida", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await onImageUrlChange(url);
      toast({ title: "Foto de perfil atualizada!" });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a foto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await onImageUrlChange("");
      setUrl("");
      toast({ title: "Foto de perfil removida!" });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <Avatar className="w-24 h-24 ring-4 ring-background shadow-xl">
        <AvatarImage src={currentImageUrl} alt={userName} />
        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
          {userInitials}
        </AvatarFallback>
      </Avatar>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 shadow-md"
          >
            <Image className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar foto de perfil</DialogTitle>
            <DialogDescription>
              Insira a URL de uma imagem para usar como foto de perfil.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={url || currentImageUrl} alt={userName} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL da imagem</label>
            <Input
              placeholder="https://exemplo.com/minha-foto.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Dica: Use imagens de serviços como Gravatar, Imgur, ou qualquer
              URL pública.
            </p>
          </div>

          <DialogFooter className="gap-2">
            {currentImageUrl && (
              <Button
                variant="destructive"
                onClick={handleRemove}
                disabled={loading}
              >
                {loading ? "Removendo..." : "Remover"}
              </Button>
            )}
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
