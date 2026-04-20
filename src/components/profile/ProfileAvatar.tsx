// src/components/profile/ProfileAvatar.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string;
  onAvatarChange?: (file: File) => Promise<void>;
}

export function ProfileAvatar({ name, avatarUrl, onAvatarChange }: ProfileAvatarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleAvatarClick = async () => {
    if (!onAvatarChange) return;
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploading(true);
        try {
          await onAvatarChange(file);
          toast({ title: "Avatar atualizado com sucesso!" });
        } catch {
          toast({ title: "Erro ao atualizar avatar", variant: "destructive" });
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div
      className="relative cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleAvatarClick}
    >
      <Avatar className="w-24 h-24 ring-4 ring-primary/20">
        <AvatarFallback className="text-3xl font-bold bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      {(isHovering || uploading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/20"
            disabled={uploading}
          >
            <Camera className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}