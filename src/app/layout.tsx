import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/Providers";

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
        <Providers>
          <div className="min-h-screen gradient-background overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
