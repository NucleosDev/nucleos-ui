import { AppLoader } from "@/components/logo-loader-provider";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

export function Loading(props: LoadingProps) {
  // Usa o mesmo loader global, mas sem o delay (útil para carregamentos locais)
  return <AppLoader isLoading={true} />;
}
