import localFont from "next/font/local";
import "./globals.css";
import ClientProvider from './components/ClientProvider'; // Separate client-side logic
import Navbar from "./components/Navbar";
import BackgroundAnimation from "./components/BackgroundAnimation";
import BackToTop from './components/BackToTop'; 

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
  title: "Wajibati",
  description: "Simplifiez l'étude à domicile pour tous",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/fav.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <Navbar />
          <BackgroundAnimation />
          {children}
          <BackToTop />
        </ClientProvider>
      </body>
    </html>
  );
}
