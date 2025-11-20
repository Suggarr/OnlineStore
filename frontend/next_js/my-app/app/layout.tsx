import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OnlineStore — Электроника",
  description: "Интернет-магазин электроники",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <LocaleProvider>
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
            <Header />
            <main>{children}</main>
            <Footer />
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}