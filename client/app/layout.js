import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "מערכת ניטור שדרים",
  description: "נבנה על ידי רזיאל רשד",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative w-full h-screen overflow-hidden`}>
        {children}
        <div className="fixed bottom-0 left-0 w-full text-center py-1 bg-slate-500  text-white">
          נבנה ע"י רזיאל רשד
        </div>
      </body>
    </html>
  );
}
