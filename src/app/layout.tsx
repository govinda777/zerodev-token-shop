import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { TokenProvider } from "@/components/auth/TokenProvider";
import { InvestmentProvider } from "@/components/investment/InvestmentProvider";
import { ZeroDevTransactionProvider } from "@/components/common/ZeroDevTransactionProvider";
import { NetworkStatusIndicator } from "@/components/common/NetworkStatusIndicator";
import { WalletDebugPanel } from '@/components/common/WalletDebugPanel';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "ZeroDev Token Shop",
  description: "Marketplace de tokens com Account Abstraction",
  icons: {
    icon: '/favicon.ico',
  },
};

declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-black text-white antialiased`}>
        <AuthProvider>
          <TokenProvider>
            <ZeroDevTransactionProvider>
              <InvestmentProvider>
                <div className="min-h-screen gradient-background overflow-hidden">
                  {children}
                  <NetworkStatusIndicator />
                  <WalletDebugPanel />
                </div>
              </InvestmentProvider>
            </ZeroDevTransactionProvider>
          </TokenProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
