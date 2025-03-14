import type { Metadata } from "next";
import { geistMono,geistSans } from "./ui/fonts";
import "./ui/globals.css";
import NavLinks from "./ui/navLinks"
import Logo from "./ui/Logo"



export const metadata: Metadata = {
  title: "Catarsis"
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <Logo/>
          <nav>
            <NavLinks/>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
