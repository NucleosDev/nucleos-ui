export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-4xl mx-auto">

        
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Política de Cookies
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Saiba como utilizamos cookies para melhorar sua experiência no Nucleos UI.
          </p>
        </div>

        
        <div className="space-y-8">

          
          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">O que são cookies?</h2>
            <p className="mt-3 text-muted-foreground">
              Cookies são pequenos arquivos armazenados no seu dispositivo
              que ajudam o site a funcionar corretamente e a lembrar suas preferências.
            </p>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">Como usamos os cookies</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground list-disc ml-5">
              <li>Garantir o funcionamento do site</li>
              <li>Melhorar desempenho e velocidade</li>
              <li>Entender o comportamento dos usuários</li>
              <li>Salvar preferências</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">Tipos de cookies</h2>
            <div className="mt-4 space-y-3 text-muted-foreground">
              <p><strong>Essenciais:</strong> necessários para o funcionamento</p>
              <p><strong>Desempenho:</strong> ajudam a melhorar o site</p>
              <p><strong>Funcionais:</strong> salvam suas preferências</p>
            </div>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">Cookies de terceiros</h2>
            <p className="mt-3 text-muted-foreground">
              Podemos usar ferramentas externas (como analytics) que utilizam cookies
              para coletar dados anônimos sobre uso da plataforma.
            </p>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">🛠️ Como gerenciar cookies</h2>
            <p className="mt-3 text-muted-foreground">
              Você pode desativar cookies nas configurações do seu navegador.
              Isso pode impactar algumas funcionalidades do site.
            </p>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">Atualizações</h2>
            <p className="mt-3 text-muted-foreground">
              Esta política pode ser atualizada periodicamente. Recomendamos revisá-la regularmente.
            </p>
          </section>

          <section className="p-6 rounded-2xl border bg-card">
            <h2 className="text-xl font-semibold">Contato</h2>
            <p className="mt-3 text-muted-foreground">
              Em caso de dúvidas, entre em contato pela página de contato.
            </p>
          </section>

        </div>

        
        <div className="mt-16 text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Nucleos. Todos os direitos reservados.
        </div>

      </div>
    </main>
  );
}