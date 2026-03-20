import { Github, Twitter, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  produto: [
    { label: "Recursos", href: "/recursos" },
    { label: "Como funciona", href: "/como-funciona" },
    { label: "Precos", href: "/planos" },
    { label: "FAQ", href: "/duvidas" },
  ],
  empresa: [
    { label: "Sobre nos", href: "/sobre" },
    { label: "Blog", href: "/blog" },
    { label: "Carreiras", href: "/carreiras" },
    { label: "Contato", href: "/contato" },
  ],
  legal: [
    { label: "Termos de uso", href: "/termos" },
    { label: "Privacidade", href: "/privacidade" },
    { label: "Cookies", href: "/cookies" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
]

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <Image 
                src="/icon.svg" 
                alt="Nucleos Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold">Nucleos</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Organize sua vida, evolua todos os dias. O sistema de organizacao pessoal que transforma habitos em conquistas.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nucleos. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Feito com dedicacao no Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}