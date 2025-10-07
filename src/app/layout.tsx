'use client'

// css imports
import "@/styles/globals.css";

// providers imports
import { HeroUIProvider } from "@heroui/react";

// components imports
import Wrapper from "@/components/Wrapper";
import SideBar from "@/components/SideBar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body>
        <HeroUIProvider>
          <Wrapper>
            <SideBar />
            <div>
              {children}
              <Footer />
            </div>
          </Wrapper>
        </HeroUIProvider>
      </body>
    </html>
  );
}
