import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VerificationProvider } from "./context/VerificationContext"; // Import the provider
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEOMatter.in - Verify Your Humanity",
  description: "Access exclusive SEO tools by proving you're a unique human with World ID.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VerificationProvider>{children}</VerificationProvider>
      </body>
    </html>
  );
}