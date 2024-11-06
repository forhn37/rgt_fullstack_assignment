import Link from "next/link";
import "./globals.css";
import Image from "next/image";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="w-screen h-screen">
        <Link href ='/'>
        <button className="text-2xl px-5 mt-3">
          <Image src='/home.png' alt="home" width={50} height={50} />
            </button></Link>
        {children}
      </body>
    </html>
  );
}
