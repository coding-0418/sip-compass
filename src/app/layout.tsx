import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SIP Compass",
  description: "A conceptual SIP guidance prototype in a Groww-inspired interface.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F0F1F3]">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-white shadow-xl sm:my-4 sm:min-h-[860px] sm:rounded-[2rem] sm:border sm:border-border overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
