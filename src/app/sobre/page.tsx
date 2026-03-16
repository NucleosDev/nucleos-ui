// importar os componentes necessários
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
//importar os componentes necessários abaixo
// exemplo 'import { Button } from '@/components/ui/button'
import { HeroScroll } from '@/components/about/hero-scroll'

// funcao exportavel pra criar a página
export default function AboutPage() {
    return (
        // estrutura da página
        <div className="">
            {/* cabecalho */}
            <Header />

            {/* conteudo */}
            <div >
            <HeroScroll />
           
            <h1 className='text-4xl font-bold'>Sobre</h1>
            {/* <Features/> */}
            </div>
            

            {/* rodape */}
            <Footer />
        </div>
    )
}


// organizar identacao (codigo) -> Shift + Alt + F\