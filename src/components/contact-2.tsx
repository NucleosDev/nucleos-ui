import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Contact2Props {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
}

export const Contact2 = ({
  title = "Contate-nos",
  description = "O Núcleos é uma plataforma digital de organização pessoal e produtividade que permite aos usuários estruturar suas atividades e objetivos por meio da criação de núcleos de foco.",
  phone = "(24) 992479145",
  email = "nucleos@me.com",
  web = { label: "nucleos.bio", url: "nucleos.bio" },
}: Contact2Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                Detalhes do contato
              </h3>
              <ul className="ml-4 list-disc">
                <li>
                  <span className="font-bold">Celular: </span>
                  {phone}
                </li>
                <li>
                  <span className="font-bold">Email: </span>
                  <a href={`mailto:${email}`} className="underline">
                    {email}
                  </a>
                </li>
                <li>
                  <span className="font-bold">Web: </span>
                  <a href={web.url} target="_blank" className="underline">
                    {web.label}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">Primeiro Nome</Label>
                <Input type="text" id="firstname" placeholder="Primeiro Nome" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Último nome</Label>
                <Input type="text" id="lastname" placeholder="Último Nome" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Assunto</Label>
              <Input type="text" id="Assunto" placeholder="Assunto" />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea placeholder="Escreva sua mensagem aqui." id="Mensagem" />
            </div>
            <Button className="w-full">Enviar Mensagem</Button> 
          </div>
        </div>
      </div>
    </section>
  );
};
