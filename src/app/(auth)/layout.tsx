import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Entre na sua conta Nucleos para continuar sua jornada de evolução.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* <Header /> */}
      {children}
    </div>
  );
}
