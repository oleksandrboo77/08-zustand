import type { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "404 - Page not found",
  description: "Sorry, the page you are looking for does not exist.",
  openGraph: {
    title: "404 - Page not found",
    description: "Sorry, the page you are looking for does not exist.",
    url: "https://ac.goit.global/fullstack/react/404",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFoundPage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
