import type { Metadata } from "next";

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
  return <div>{children}</div>;
}
