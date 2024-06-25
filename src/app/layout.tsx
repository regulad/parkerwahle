import type {Metadata} from "next";
import {Inter, Libre_Franklin} from "next/font/google";
import {GoogleAnalytics} from "@next/third-parties/google"
import "./globals.css";
import {clsx} from "clsx";

const inter = Inter({subsets: ["latin"]});

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
})

export const metadata: Metadata = {
  title: {
    template: "%s | Parker Wahle",
    default: "Parker Wahle",
  },
  description: "Homepage of Parker Wahle",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={clsx(inter.className, libre_franklin.className)}>{children}</body>
    <GoogleAnalytics gaId="G-Y3206D9PHB"/>
    </html>
  );
}
