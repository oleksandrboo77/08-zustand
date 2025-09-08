import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  display: "swap",
});

const APP_URL = "https://ac.goit.global/fullstack/react/";
const APP_TITLE = "NoteHub";
const APP_DESC = "NoteHub — fast notes with tags, search, and preview.";

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESC,
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: APP_TITLE,
    description: APP_DESC,
    url: APP_URL,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
