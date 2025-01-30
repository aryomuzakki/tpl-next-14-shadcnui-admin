import localFont from "next/font/local";
import "./globals.css";
import LayoutOne from "@/components/layout/LayoutOne";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Backoffice | Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>

      <meta name="robots" content="noindex, nofollow" />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutOne>
          {children}
        </LayoutOne>
      </body>
    </html>
  );
}
