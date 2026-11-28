import type { Metadata } from "next";
import { Inter, Libre_Franklin } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google"
import "./globals.css";
import { clsx } from "clsx";
import { TileTransitionProvider } from "@/components/ui/tileTransition/tileTransition";

// The landing property's Google Analytics tag: NEXT_PUBLIC_GA_TAG, which regulad/homelab's
// tofu/vercel sets from tofu/ga4, read at build time, or the same tag by default.
const GA_TAG = process.env.NEXT_PUBLIC_GA_TAG || "G-Y3206D9PHB";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={clsx(inter.className, libre_franklin.className)}>
        <TileTransitionProvider>
          {children}
        </TileTransitionProvider>
      </body>
      <GoogleAnalytics gaId={GA_TAG} />
    </html>
  );
}
