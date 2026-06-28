"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Eye, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArtigoCardProps {
  titulo: string;
  slug: string;
  resumo: string;
  tempoLeitura: string;
  visualizacoes: string;
  data: string;
  categoria?: string;
  categoriaCor?: string;
  index: number;
}

export function ArtigoCard({ 
  titulo, 
  slug, 
  resumo, 
  tempoLeitura, 
  visualizacoes, 
  data,
  categoria,
  categoriaCor = "#4D7CFF",
  index 
}: ArtigoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/ajuda/artigo/${slug}`}>
        <Card className="group h-full border-2 border-transparent hover:border-[#4D7CFF]/20 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardContent className="p-6 relative">
            {/* Gradiente de hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4D7CFF]/0 via-transparent to-[#00C9A7]/0 group-hover:from-[#4D7CFF]/5 group-hover:to-[#00C9A7]/5 transition-all duration-500" />
            
            {/* Categoria (se fornecida) */}
            {categoria && (
              <Badge
                variant="outline"
                className="mb-3 text-xs"
                style={{ 
                  backgroundColor: `${categoriaCor}10`,
                  borderColor: `${categoriaCor}30`,
                  color: categoriaCor,
                }}
              >
                {categoria}
              </Badge>
            )}

            <h3 className="font-semibold text-lg mb-2 group-hover:text-[#4D7CFF] transition-colors">
              {titulo}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {resumo}
            </p>

            {/* Metadados */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {tempoLeitura}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {visualizacoes}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(data).toLocaleDateString("pt-BR")}
              </span>
            </div>

            {/* Link "Ler mais" que aparece no hover */}
            <motion.div 
              className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
              animate={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="size-4 text-[#4D7CFF]" />
            </motion.div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}