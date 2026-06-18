"use client";
import NucleosMost from "@/components/ui/dashboard-nucleos-most";
import { motion } from "framer-motion";

export default function DashboardMosty() {
  return (
    <section className="relative min-h-screen bg-[#000]">
      <div className="absolute top-0 left-0 right-0  pointer-events-none z-10 " />

      {/* GRADIENTE INFERIOR */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 " />

      {/* SEGUNDA CAMADA DE DEGRADÊ */}
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 " />

      {/* Background elements com parallax */}
      <motion.div className="absolute inset-0 -z-10"></motion.div>
      <NucleosMost />
    </section>
  );
}
