"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/auth";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function GoogleAuthButton() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      <div className="w-full overflow-hidden rounded-xl [&>div]:!w-full [&>div>div]:!w-full [&_iframe]:!w-full">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (!credentialResponse.credential) return;
            setLoading(true);
            try {
              await loginWithGoogle(credentialResponse.credential);
              router.push("/dashboard");
            } catch {
              toast({ title: "Erro ao entrar com Google", variant: "destructive" });
            } finally {
              setLoading(false);
            }
          }}
          onError={() =>
            toast({ title: "Erro ao entrar com Google", variant: "destructive" })
          }
          width="384"
          theme="outline"
          size="large"
          text="continue_with"
          locale="pt_BR"
          shape="rectangular"
        />
      </div>
    </div>
  );
}
