export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-4xl mx-auto">

        
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Carreiras
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Junte-se ao time do Nucleos UI e ajude a construir ferramentas incríveis para desenvolvedores.
          </p>
        </div>

        
        <div className="space-y-8">

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">🚀 Por que trabalhar conosco?</h2>
            <p className="mt-3 text-muted-foreground">
              Estamos construindo uma plataforma moderna focada em performance,
              design e experiência do desenvolvedor. Valorizamos inovação,
              simplicidade e qualidade.
            </p>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">🌍 Ambiente de trabalho</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground list-disc ml-5">
              <li>Ambiente remoto e flexível</li>
              <li>Foco em autonomia e produtividade</li>
              <li>Cultura colaborativa</li>
              <li>Projetos modernos com tecnologias atuais</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">🧑‍💻 O que buscamos</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground list-disc ml-5">
              <li>Desenvolvedores apaixonados por UI/UX</li>
              <li>Experiência com React, Next.js e Tailwind</li>
              <li>Proatividade e vontade de aprender</li>
              <li>Boa comunicação e trabalho em equipe</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">📂 Vagas abertas</h2>
            <p className="mt-3 text-muted-foreground">
              No momento, não temos vagas abertas. Mas estamos sempre em busca
              de talentos — envie seu contato!
            </p>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">📩 Como se candidatar</h2>
            <p className="mt-3 text-muted-foreground">
              Envie seu portfólio, GitHub ou currículo através da página de contato.
            </p>
          </section>

        </div>

        
        <div className="mt-16 text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Nucleos UI. Todos os direitos reservados.
        </div>

      </div>
    </main>
  );
}