import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '\u5b89\u9e97\u8cc7\u6599\u842c\u80fd\u5eab',
  description: '\u6574\u7406\u5b89\u9e97\u7522\u54c1\u3001\u5716\u7247\u6587\u5b57\u3001\u554f\u7b54\u8207\u4e8b\u696d\u7b46\u8a18\u7684\u8cc7\u6599\u5eab\u3002',
  keywords: ['Amway', 'Nutrilite', 'eSpring', 'Atmosphere'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
