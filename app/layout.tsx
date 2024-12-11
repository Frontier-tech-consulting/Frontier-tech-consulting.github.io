import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frontier-tech',
  description: 'primier web3/ AI consulting firm for building next scalable apps .',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
