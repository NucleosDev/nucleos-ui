import { AuthProvider } from '@/auth/auth-provider'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}