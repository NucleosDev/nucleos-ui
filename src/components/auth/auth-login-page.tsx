"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AppleIcon,
  AtSignIcon,
  ChevronLeftIcon,
  GithubIcon,
  Grid2x2PlusIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/auth/auth-context";

export function AuthPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div aria-hidden className="absolute inset-0 isolate">
          <div
            className="
    absolute top-0 right-0 h-[320px] w-[560px] -translate-y-[350px] rounded-full
    bg-[radial-gradient(68%_68%_at_55%_31%,rgb(108, 140, 255)_0%,#0D0F14_50%,rgba(108, 140, 255, 0.43)_80%)]
  "
          />

          <div
            className="
    absolute top-0 right-0 h-[320px] w-[240px] translate-x-[5%] -translate-y-[50%] rounded-full
    bg-[radial-gradient(50%_50%,rgb(31, 191, 167)_0%,rgba(31, 191, 167, 0.8)_80%,transparent_100%)]
  "
          />

          <div
            className="
    absolute top-0 right-0 h-[320px] w-[240px] -translate-y-[350px] rounded-full
    bg-[radial-gradient(50%_50%,rgba(108,140,255,0.06)_0%,rgb(108, 140, 255)_80%,transparent_100%)]
  "
          />
        </div>
        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <Link href="/">
            <ChevronLeftIcon className="size-4 me-2" />
            Voltar ao Início
          </Link>
        </Button>

        <div className="mx-auto flex flex-col items-center space-y-6 sm:w-lg">
          {/* Logo e título para mobile */}
          <div className=" flex w-full flex-col items-center gap-3 lg:hidden">
            <Image
              src={"/logo-full.svg"}
              alt="logo nucleos"
              width={650}
              height={650}
              className="
    absolute top-0 left-0
    -translate-x-1/3 -translate-y-1/3
    opacity-20
    -rotate-[10deg]
    pointer-events-none
  "
            />

            <Image
              src={"/logo-full.svg"}
              alt="logo nucleos"
              width={650}
              height={650}
              className="
    absolute bottom-0 right-0
    translate-x-1/3 translate-y-1/3
    opacity-20
    rotate-[18deg]
    scale-x-[-1]
    pointer-events-none
  "
            />

            {/* Container do logo e nome */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-[#4D7CFF]/10 via-[#00C9A7]/10 to-[#4D7CFF]/10 p-2 backdrop-blur-sm">
                <Image
                  src={"/icon.svg"}
                  width={40}
                  height={40}
                  alt="logo"
                  className="grayscale contrast-125 brightness-90"
                />
              </div>
              <p className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-2xl font-bold text-transparent bg-[length:200%_auto] animate-gradient">
                Nucleos
              </p>
            </div>

            {/* Linha decorativa */}
            <div className="my-1 h-px w-16 bg-gradient-to-r from-transparent via-[#00C9A7]/50 to-transparent" />
          </div>

          <div className="flex w-full flex-col space-y-3">
            <div className="space-y-1.5 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-wide lg:text-3xl">
                Bem vindo de volta!
              </h1>
              <p className="text-muted-foreground text-base">
                Preencha os dados abaixo e acesse sua conta.
              </p>
            </div>
            <div className="absolute inset-0 -z-50">
              <div className="absolute inset-0 -z-50">
                {/* Base */}
                <div className="absolute inset-0 -z-50">
                  {/* Base */}
                  <div
                    className="
      absolute top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2
      w-[520px] h-[400px]
      rounded-full
      bg-[#4D7CFF]/20
      blur-3xl
    "
                  />

                  {/* Camada verde */}
                  <div
                    className="
      absolute top-1/2 left-1/2
      -translate-x-[40%] -translate-y-[60%]
      w-[420px] h-[620px]
      rounded-full
      bg-[#00C9A7]/20
      blur-3xl
    "
                  />

                  {/* Azul secundário */}
                  <div
                    className="
      absolute top-1/2 left-1/2
      -translate-x-[60%] -translate-y-[30%]
      w-[400px] h-[600px]
      rounded-full
      bg-[#5B7FFF]/20
      blur-3xl
    "
                  />

                  {/* Verde secundário */}
                  <div
                    className="
      absolute top-1/2 left-1/2
      -translate-x-[30%] -translate-y-[40%]
      w-[380px] h-[580px]
      rounded-full
      bg-[#1FBFA8]/20
      blur-3xl
    "
                  />
                </div>

                {/* Camada verde */}
                <div
                  className="
      absolute top-1/2 left-1/2
      -translate-x-[40%] -translate-y-[60%]
      size-[420px]
      rounded-full
      bg-[#00C9A7]/20
      blur-3xl
    "
                />

                {/* Azul secundário */}
                <div
                  className="
      absolute top-1/2 left-1/2
      -translate-x-[60%] -translate-y-[50%]
      size-[450px]
      rounded-full
      bg-[#5B7FFF]/20
      blur-3xl
    "
                />

                {/* Verde secundário */}
                <div
                  className="
      absolute top-1/2 left-1/2
      -translate-x-[30%] -translate-y-[40%]
      size-[380px]
      rounded-full
      bg-[#1FBFA8]/20
      blur-3xl
    "
                />
              </div>
            </div>
            <div className="w-full">
              <LoginForm />

              {/* Separador */}
              <div className="my-4 flex items-center gap-2 w-full">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">ou</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* GOOGLE LOGIN */}
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log("GOOGLE OK:", credentialResponse);
                    if (credentialResponse.credential) {
                      loginWithGoogle(credentialResponse.credential);
                    }
                  }}
                  onError={() => {
                    console.log("ERRO GOOGLE");
                  }}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  width="100%"
                />
              </div>
            </div>
          </div>

          {/* <div className="space-y-2">
            <Button type="button" size="lg" className="w-full">
              <GoogleIcon className="size-4 me-2" />
              Continue with Google
            </Button>
            <Button type="button" size="lg" className="w-full">
              <AppleIcon className="size-4 me-2" />
              Continue with Apple
            </Button>
            <Button type="button" size="lg" className="w-full">
              <GithubIcon className="size-4 me-2" />
              Continue with GitHub
            </Button>
          </div> */}

          {/* <AuthSeparator /> */}

          {/* <form className="space-y-2">
            <p className="text-muted-foreground text-start text-xs">
              Enter your email address to sign in or create an account
            </p>
            <div className="relative h-max">
              <Input
                placeholder="your.email@example.com"
                className="peer ps-9"
                type="email"
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <AtSignIcon className="size-4" aria-hidden="true" />
              </div>
            </div>

            <Button type="button" className="w-full">
              <span>Continue With Email</span>
            </Button>
          </form> */}
          {/* <p className="text-muted-foreground mt-8 text-sm">
            By clicking continue, you agree to our{" "}
            
              href="@"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </p> */}
        </div>
      </div>

      {/* cores do fundo e das linhas animadas ["#4D7CFF", "#00C9A7", "#5B7FFF", "#1FBFA8"];*/}
      <div
        className="
    relative hidden  flex-col border-r p-10 lg:flex items-right
    bg-gradient-to-b 
    from-[#00C9A7]/75 
    via-[#5B7FFF]/35
    via-[#4D7CFF]/35
    via-[#1FBFA8]/30
    to-background
  "
      >
        <Image
          src={"/logo-full.svg"}
          alt="logo nucleos"
          width={600}
          height={600}
          className="absolute right-35 top-50 z-10 opacity-50"
        />
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center justify-end w-full gap-2 text-right">
          {/* <Grid2x2PlusIcon className="size-6" /> */}
          <p className="text-xl font-semibold">Nucleos</p>
        </div>
        <div className="z-10 mt-auto w-full text-right">
          <blockquote className="space-y-">
            <p className="text-xl">
              &ldquo;É melhor você tentar, ver não funcionar e aprender com
              isso, do que não fazer nada.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold">
              ~ Mark Zuckerberg
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
    </main>
  );
}

function FloatingPaths({ position }: { position: number }) {
  const COLORS = ["#4D7CFF", "#00C9A7", "#5B7FFF", "#1FBFA8"];

  const paths = Array.from({ length: 36 }, (_, i) => {
    const color = COLORS[i % COLORS.length];

    return {
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
        380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
        152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
        684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      stroke: color,
      width: 0.5 + i * 0.03,
      opacity: 0.12 + i * 0.02,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>

        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.stroke}
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.2, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.7, 0.9, 0.7],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 18 + Math.random() * 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
);

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground px-2 text-xs">OR</span>
      <div className="bg-border h-px w-full" />
    </div>
  );
};
