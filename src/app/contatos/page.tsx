// importar os componentes necessários
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
//importar os componentes necessários abaixo
// exemplo 'import { Button } from '@/components/ui/button'
import { Contact2 } from '@/components/contact-2'

// funcao exportavel pra criar a página
export default function AboutPage() {
    return (
        // estrutura da página
        <div className="">
            {/* cabecalho */}
            <Header />
            
            {/* conteudo */}
            <div >
            <Contact2 />
            </div>


            {/* rodape */}
            <Footer />
        </div>
    )
}


// organizar identacao (codigo) -> Shift + Alt + F\