import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
