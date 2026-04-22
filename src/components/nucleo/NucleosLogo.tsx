"use client";

import React from "react";
import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

interface NucleosLogoProps {
  /** Define o tamanho do componente (ícone + texto) */
  size?: LogoSize;
  /** Classes CSS adicionais para customização externa */
  className?: string;
  /** Caminho opcional para a imagem, caso queira passar via prop */
  logoUrl?: string;
}

const NucleosLogo: React.FC<NucleosLogoProps> = ({
  size = "md",
  className = "",
  logoUrl = "/logo-full.svg",
}) => {
  // Mapeamento de estilos com tipagem estrita
  const sizes: Record<
    LogoSize,
    { container: string; icon: string; gap: string }
  > = {
    sm: { container: "text-lg", icon: "h-6 w-6", gap: "gap-2" },
    md: { container: "text-2xl", icon: "h-8 w-8", gap: "gap-3" },
    lg: { container: "text-4xl", icon: "h-12 w-12", gap: "gap-4" },
  };

  const currentSize = sizes[size];

  return (
    <div
      className={`flex items-center font-sans tracking-tight ${currentSize.gap} ${className}`}
    >
      {/* Container do Ícone usando Next.js Image */}
      <div className={`${currentSize.icon} relative shrink-0`}>
        <Image
          src={logoUrl}
          alt="Nucleos Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Texto Nucleos com Tag Semântica h2 */}
      <h2 className={`font-semibold text-foreground ${currentSize.container}`}>
        Nucleos
      </h2>
    </div>
  );
};

export default NucleosLogo;
