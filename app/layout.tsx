import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '安麗萬能資料庫 - 營養、淨水器、空氣清淨機與事業問答共享網頁',
  description:
    '專為安麗團隊設計的萬能資料庫網頁版，整合營養保健、eSpring淨水器、Atmosphere空氣清淨機與事業發展90天問答知識庫，支援Vercel一鍵部署與多人雲端共享。',
  keywords: [
    '安麗',
    '安麗萬能資料庫',
    '鈕崔萊',
    'Nutrilite',
    'eSpring',
    'Atmosphere Sky',
    '安麗事業',
    'Vercel共享',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
