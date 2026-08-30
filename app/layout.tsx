import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xxiaoxiong.github.io/learn-munder-difflin/"),
  title: "Munder Difflin 架构学习手册",
  description: "从固定源码快照理解 Munder Difflin 的 Electron、PTY、Hive、多 Agent 编排、状态存储与可视化边界。",
  keywords: ["Munder Difflin", "AI Agent", "Electron", "node-pty", "multi-agent", "architecture"],
  openGraph: {
    title: "Munder Difflin 架构学习手册",
    description: "一份面向二次开发者、由源码证据驱动的交互式架构地图。",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    images: [{ url: "https://xxiaoxiong.github.io/learn-munder-difflin/og-control-plane.png", width: 1706, height: 909, alt: "Munder Difflin multi-agent control plane illustration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Munder Difflin 架构学习手册",
    description: "由源码证据驱动的 Electron、PTY 与 Hive 交互式架构地图。",
    images: ["https://xxiaoxiong.github.io/learn-munder-difflin/og-control-plane.png"],
  },
  icons: {
    icon: "https://xxiaoxiong.github.io/learn-munder-difflin/favicon.svg",
    shortcut: "https://xxiaoxiong.github.io/learn-munder-difflin/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
