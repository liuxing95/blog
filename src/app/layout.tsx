import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAProvider from "@/components/PWAProvider";
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
  title: "Devin's Blog",
  description: "分享前端开发经验、技术思考和项目实践的个人博客",
  keywords: ["前端开发", "React", "Next.js", "JavaScript", "TypeScript", "博客"],
  authors: [{ name: "Devin" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Devin's Blog",
    description: "分享前端开发经验、技术思考和项目实践的个人博客",
    type: "website",
    locale: "zh_CN",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Devin's Blog",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <PWAProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </PWAProvider>
      </body>
    </html>
  );
}
