import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/Providers";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-900 my-2">
                      ZeroDev Token Shop
                    </h1>
                  </div>
                  <div className="flex items-center">
                    {/* LoginButton will be imported and used here */}
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
