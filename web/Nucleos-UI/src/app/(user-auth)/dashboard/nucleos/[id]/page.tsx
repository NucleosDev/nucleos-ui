// src/app/(user-auth)/dashboard/nucleos/[id]/page.tsx
"use client";

import { useParams, notFound } from "next/navigation";
import { useNucleo } from "@/hooks/useNucleo";
import { NucleoDocument } from "@/components/document";
import { Skeleton } from "@/components/ui/skeleton";

export default function NucleoDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: nucleo, isLoading, error } = useNucleo(id);

  if (isLoading) {
    return (
      <div className="">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-10 w-1/2 rounded-lg" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-32 w-full rounded-xl mt-6" />
      </div>
    );
  }

  if (error || !nucleo) notFound();

  return <NucleoDocument nucleoId={id} />;
}
