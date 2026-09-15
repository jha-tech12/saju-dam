import type { Metadata } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const nanumBatang = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nanum-batang",
  display: "swap",
});

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "사주담 | 사주를 바탕으로 나누는 이야기",
  description:
    "정확한 사주 명식과 명리학을 바탕으로 AI가 당신의 질문에 답하는 AI 사주 상담 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${nanumBatang.variable} ${pretendard.variable}`}>
      <body className={`${pretendard.className} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
