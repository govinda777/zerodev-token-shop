import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/Providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "ZeroDev Token Shop",
  description: "A simple e-commerce example using ZeroDev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-black text-white antialiased`}>
        <Script id="warning-suppressor" strategy="beforeInteractive">
          {`
            // Suprimir warnings conhecidos e não críticos em desenvolvimento
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
              const originalWarn = console.warn;
              const originalError = console.error;
              
              const suppressedPatterns = [
                'mathTaming',
                'dateTaming', 
                'Removing unpermitted intrinsics',
                'toTemporalInstant',
                'lockdown-install.js'
              ];
              
              console.warn = (...args) => {
                const message = args.join(' ');
                if (!suppressedPatterns.some(pattern => message.includes(pattern))) {
                  originalWarn.apply(console, args);
                }
              };
              
              console.error = (...args) => {
                const message = args.join(' ');
                if (!suppressedPatterns.some(pattern => message.includes(pattern))) {
                  originalError.apply(console, args);
                }
              };
            }
          `}
        </Script>
        <Script id="rpc-interceptor" strategy="beforeInteractive">
          {`
            // Interceptação global robusta para drpc.org
            (function() {
              if (typeof window === 'undefined') return;
              
              let interceptorInstalled = false;
              
              function installInterceptor() {
                if (interceptorInstalled || !window.fetch) return;
                
                const originalFetch = window.fetch;
                window.fetch = function(input, init) {
                  try {
                    const url = typeof input === 'string' ? input : 
                               input instanceof URL ? input.href : 
                               input && input.url ? input.url : '';
                    
                    if (url && url.includes('sepolia.drpc.org')) {
                      console.log('🚫 Global interceptor: Blocked drpc.org request, redirecting to rpc.sepolia.org');
                      
                      const newUrl = url.replace(/https?:\\/\\/sepolia\\.drpc\\.org/g, 'https://rpc.sepolia.org');
                      const newInput = typeof input === 'string' ? newUrl :
                                      input instanceof URL ? new URL(newUrl) :
                                      { ...input, url: newUrl };
                      
                      return originalFetch.call(this, newInput, init);
                    }
                    
                    return originalFetch.call(this, input, init);
                  } catch (error) {
                    console.error('Error in fetch interceptor:', error);
                    return originalFetch.call(this, input, init);
                  }
                };
                
                interceptorInstalled = true;
                console.log('✅ Global RPC interceptor installed');
              }
              
              // Instalar imediatamente
              installInterceptor();
              
              // Garantir que seja instalado após carregamento da página
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', installInterceptor);
              }
              
              // Interceptar XMLHttpRequest também
              if (window.XMLHttpRequest) {
                const originalXHROpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url, ...args) {
                  if (typeof url === 'string' && url.includes('sepolia.drpc.org')) {
                    console.log('🚫 XHR interceptor: Blocked drpc.org request');
                    url = url.replace(/https?:\\/\\/sepolia\\.drpc\\.org/g, 'https://rpc.sepolia.org');
                  }
                  return originalXHROpen.call(this, method, url, ...args);
                };
              }
            })();
          `}
        </Script>
        <Providers>
          <div className="min-h-screen gradient-background overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
