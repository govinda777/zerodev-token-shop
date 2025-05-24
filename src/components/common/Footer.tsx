import Link from "next/link";

export function Footer() {
  return (
    <footer className="glass padding-section mt-16 md:mt-24 border-t border-white/10">
      <div className="container-responsive">
        <div className="card-grid-auto space-content">
          <div className="lg:col-span-2">
            <h3 className="text-responsive-xl font-bold text-white mb-4 neon-text">ZeroDev Token Shop</h3>
            <p className="text-white/90 leading-relaxed text-responsive-sm">
              A plataforma líder em tokens digitais únicos. Conecte sua carteira e explore um universo de possibilidades.
            </p>
          </div>
          
          <nav aria-label="Links rápidos">
            <h4 className="text-white font-semibold mb-4 text-responsive-base">Links Rápidos</h4>
            <div className="space-items">
              <Link href="/marketplace" className="block text-white/80 hover:text-purple-300 transition-colors text-responsive-sm">
                Marketplace
              </Link>
              <Link href="/wallet" className="block text-white/80 hover:text-purple-300 transition-colors text-responsive-sm">
                Minha Carteira
              </Link>
              <Link href="/" className="block text-white/80 hover:text-purple-300 transition-colors text-responsive-sm">
                Início
              </Link>
            </div>
          </nav>
          
          <nav aria-label="Suporte">
            <h4 className="text-white font-semibold mb-4 text-responsive-base">Suporte</h4>
            <div className="space-items">
              <Link href="/help" className="block text-white/80 hover:text-purple-300 transition-colors text-responsive-sm">
                Central de Ajuda
              </Link>
              <Link href="/faq" className="block text-white/80 hover:text-purple-300 transition-colors text-responsive-sm">
                FAQ
              </Link>
              <Link href="/contact" className="block text-white/80 hover:text-purple-300 transition-colors text-responsive-sm">
                Contato
              </Link>
            </div>
          </nav>
        </div>
        
        <div className="border-t border-white/10 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-responsive-xs text-center md:text-left">
              © {new Date().getFullYear()} ZeroDev Token Shop. Todos os direitos reservados.
            </p>
            <nav aria-label="Links legais" className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/terms" className="text-white/80 hover:text-purple-300 transition-colors text-responsive-xs">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-white/80 hover:text-purple-300 transition-colors text-responsive-xs">
                Política de Privacidade
              </Link>
              <Link href="/support" className="text-white/80 hover:text-purple-300 transition-colors text-responsive-xs">
                Suporte
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
} 