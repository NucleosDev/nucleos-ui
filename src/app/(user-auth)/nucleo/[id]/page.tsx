import { notFound } from "next/navigation";
import { nucleosService } from "@/services/nucleos.service";

interface NucleoPageProps {
  params: {
    id: string;
  };
}

export default async function NucleoPage({ params }: NucleoPageProps) {
  const nucleo = await nucleosService.getNucleo(params.id);

  if (!nucleo) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{nucleo.nome}</h1>
      <p className="text-muted-foreground mt-2">{nucleo.descricao}</p>
      {/* Conteúdo do núcleo será implementado depois */}
      <div className="mt-8 p-8 border rounded-lg bg-muted/20 text-center">
        <p className="text-muted-foreground">
          Conteúdo do núcleo em construção...
        </p>
      </div>
    </div>
  );
}
