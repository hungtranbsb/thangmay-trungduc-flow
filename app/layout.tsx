import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trung Đức Flow — Quản trị dự án thang máy",
  description: "Quản lý báo giá, hợp đồng, công nợ và dòng tiền cho doanh nghiệp thiết kế lắp đặt thang máy.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
