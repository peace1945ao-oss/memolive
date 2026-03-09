import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "MemoLive - 大切な人と、もう一度",
  description:
    "故人の写真と音声からAIが生成するリアルタイム通話体験。大切な人の声とぬくもりを、もう一度感じることができるメモリアルアプリです。",
  keywords: ["メモリアル", "AI", "故人", "通話", "音声", "思い出"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
