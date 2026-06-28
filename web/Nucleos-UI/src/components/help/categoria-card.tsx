"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoriaCardProps {
  icon: React.ElementType;
  titulo: string;
  descricao: string;
  cor: string;
  artigos: number;
  slug: string;
  index: number;
}

export function CategoriaCard({ 
  icon: Icon, 
  titulo, 
  descricao, 
  cor, 
  artigos, 
  slug,
  index 
}: CategoriaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/ajuda/categoria/${slug}`}>
        <Card 
          className="group h-full border-2 transition-all duration-300 hover:shadow-xl overflow-hidden"
          style={{ 
            borderColor: `${cor}20`,
            background: `linear-gradient(135deg, ${cor}05 0%, transparent 100%)`,
          }}
        >
          <CardContent className="p-6 text-center relative">
            {/* Efeito de brilho no hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{ 
                background: `radial-gradient(circle at 50% 0%, ${cor} 0%, transparent 70%)`,
              }}
            />
            
            {/* Ícone animado */}
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className="size-20 rounded-2xl flex items-center justify-center transition-all group-hover:shadow-lg"
                style={{ 
                  backgroundColor: `${cor}15`,
                  boxShadow: `0 4px 20px ${cor}20`,
                }}
              >
                <Icon className="size-8 transition-transform group-hover:scale-110" style={{ color: cor }} />
              </div>
            </motion.div>

            <h3 className="font-semibold text-lg mb-1 text-foreground">
              {titulo}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3">
              {descricao}
            </p>

            {/* Badge de contagem com estilo profissional */}
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{ 
                backgroundColor: `${cor}10`,
                borderColor: `${cor}30`,
                color: cor,
              }}
            >
              {artigos} {artigos === 1 ? 'artigo' : 'artigos'}
            </Badge>

            {/* Barra de progresso decorativa */}
            <div className="mt-4 h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min((artigos / 15) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: cor }}
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}