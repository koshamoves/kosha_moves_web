import type { Metadata, Viewport } from "next";
import { DM_Sans, Source_Sans_3, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/toast/toaster";
import { Layout } from "@/components/layout";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-dm-sans',
});
const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-source-sans',
});

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins',
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: "KoshaMoves | Book a Move",
  description: "KoshaMoves - ",
  applicationName: 'MyMedHub',
  referrer: 'origin-when-cross-origin',
  authors: [{ name: 'Nelson Michael', url: '' }],
  creator: 'Nelson Michael',
  publisher: 'Nelson Michael',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(dmSans.variable, sourceSans3.variable, poppins.variable)}>
        <Layout>
          {children}
        </Layout>
        <Toaster />
      </body>
    </html>
  );
}
