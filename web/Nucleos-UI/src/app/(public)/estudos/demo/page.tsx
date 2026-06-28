export default function TestPage() {
  return (
    <div className="p-4">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
          <span className="block text-muted-foreground/60 text-3xl sm:text-4xl md:text-5xl font-medium mb-2">
            Começando os Estudos
          </span>
          Aprendizado em uma nova experiência{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">envolvente</span>
            <span className="absolute bottom-2 left-0 right-0 h-4 bg-primary/20 -rotate-1 rounded" />
          </span>
          .
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          Pronto para transformar seus estudos?
        </p>
      </div>

      {/* video YTT */}
      <div className="min-h-screen flex items-top justify-center">
        <div className="w-full max-w-4xl">
          <div className="aspect-video w-full rounded-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/SEU_VIDEO_ID"
              allowFullScreen
            />
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              <span className="block text-muted-foreground/60 text-3xl sm:text-4xl md:text-5xl font-medium mb-2">
             
              </span>
              Depois de ver como funciona, imagine aplicar isso todos os dias.
              Mais foco, mais consistência e evolução real em cada .
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">sessão</span>
                <span className="absolute bottom-2 left-0 right-0 h-4 bg-primary/20 -rotate-1 rounded" />
              </span>
              .
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Cada matéria é um universo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
