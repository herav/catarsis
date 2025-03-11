import type { Metadata } from "next";
import { geistMono,geistSans } from "./ui/fonts";
import "./ui/globals.css";



export const metadata: Metadata = {
  title: "Catarsis"
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
