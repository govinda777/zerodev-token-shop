import Link from "next/link";

export function Footer() {
  return (
    <footer className="glass py-12 mt-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 neon-text">ZeroDev Token Shop</h3>
            <p className="text-white/90 leading-relaxed">
              A plataforma líder em tokens digitais únicos. Conecte sua carteira e explore um universo de possibilidades.
            </p>
          </div>
          <nav aria-label="Links rápidos">
            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
            <div className="space-y-2">
              <Link href="/marketplace" className="block text-white/80 hover:text-purple-300 transition-colors">
                Marketplace
              </Link>
              <Link href="/wallet" className="block text-white/80 hover:text-purple-300 transition-colors">
                Minha Carteira
              </Link>
              <Link href="/history" className="block text-white/80 hover:text-purple-300 transition-colors">
                Histórico
              </Link>
            </div>
          </nav>
          <nav aria-label="Suporte">
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <div className="space-y-2">
              <Link href="/help" className="block text-white/80 hover:text-purple-300 transition-colors">
                Central de Ajuda
              </Link>
              <Link href="/faq" className="block text-white/80 hover:text-purple-300 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="block text-white/80 hover:text-purple-300 transition-colors">
                Contato
              </Link>
            </div>
          </nav>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ZeroDev Token Shop. Todos os direitos reservados.
            </p>
            <nav aria-label="Links legais" className="flex space-x-6">
              <Link href="/terms" className="text-white/80 hover:text-purple-300 transition-colors text-sm">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-white/80 hover:text-purple-300 transition-colors text-sm">
                Política de Privacidade
              </Link>
              <Link href="/support" className="text-white/80 hover:text-purple-300 transition-colors text-sm">
                Suporte
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
} 