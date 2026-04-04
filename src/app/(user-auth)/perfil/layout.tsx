import { QueryProvider } from "@/src/providers/QueryProvider"
import type { ReactNode } from "react"

/**
 * Layout das rotas protegidas.
 * A proteção real (redirect → /entrar) é feita pelo middleware ou
 * pelo auth-context que já existe no projeto.
 */
export default function UserAuthLayout({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}
