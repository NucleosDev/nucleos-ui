import type { Metadata } from "next";
import { AuthProvider } from "@/auth";
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
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
