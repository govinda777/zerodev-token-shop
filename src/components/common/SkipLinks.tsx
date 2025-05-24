export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-4 left-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      >
        Pular para o conteúdo principal
      </a>
      <a
        href="#navigation"
        className="absolute top-4 left-48 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      >
        Pular para a navegação
      </a>
    </div>
  );
} 