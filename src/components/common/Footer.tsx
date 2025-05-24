import Link from "next/link";

export function Footer() {
  return (
    <footer className="glass py-12 md:py-16 mt-16 md:mt-24 border-t border-white/10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 neon-text">ZeroDev Token Shop</h3>
            <p className="text-white/90 leading-relaxed text-sm md:text-base">
              A plataforma líder em tokens digitais únicos. Conecte sua carteira e explore um universo de possibilidades.
            </p>
          </div>
          
          <nav aria-label="Links rápidos">
            <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Links Rápidos</h4>
            <div className="space-y-3">
              <Link href="/marketplace" className="block text-white/80 hover:text-purple-300 transition-colors text-sm md:text-base">
                Marketplace
              </Link>
              <Link href="/wallet" className="block text-white/80 hover:text-purple-300 transition-colors text-sm md:text-base">
                Minha Carteira
              </Link>
              <Link href="/" className="block text-white/80 hover:text-purple-300 transition-colors text-sm md:text-base">
                Início
              </Link>
            </div>
          </nav>
          
          <nav aria-label="Suporte">
            <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Suporte</h4>
            <div className="space-y-3">
              <Link href="/help" className="block text-white/80 hover:text-purple-300 transition-colors text-sm md:text-base">
                Central de Ajuda
              </Link>
              <Link href="/faq" className="block text-white/80 hover:text-purple-300 transition-colors text-sm md:text-base">
                FAQ
              </Link>
              <Link href="/contact" className="block text-white/80 hover:text-purple-300 transition-colors text-sm md:text-base">
                Contato
              </Link>
            </div>
          </nav>
        </div>
        
        <div className="border-t border-white/10 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} ZeroDev Token Shop. Todos os direitos reservados.
            </p>
            <nav aria-label="Links legais" className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/terms" className="text-white/80 hover:text-purple-300 transition-colors text-xs md:text-sm">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-white/80 hover:text-purple-300 transition-colors text-xs md:text-sm">
                Política de Privacidade
              </Link>
              <Link href="/support" className="text-white/80 hover:text-purple-300 transition-colors text-xs md:text-sm">
                Suporte
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
} 