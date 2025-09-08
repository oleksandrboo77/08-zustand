import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

function parseTag(slug: string[] | string | undefined): NoteTag | undefined {
  if (!slug) return undefined;
  const seg = Array.isArray(slug) ? slug[0] : slug;
  if (seg === "All") return undefined;
  const allowed: NoteTag[] = [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];
  return allowed.includes(seg as NoteTag) ? (seg as NoteTag) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = parseTag(slug);
  const pretty = tag ?? "All";

  const title = `Notes • ${pretty} — NoteHub`;
  const description = `Browse notes filtered by: ${pretty}. Find what you need fast.`;

  const base = "https://<your-vercel-domain>";
  const slugStr = Array.isArray(slug)
    ? slug.join("/")
    : (slug ?? "").toString();
  const path = slugStr ? `/notes/filter/${slugStr}` : "/notes/filter";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${base}${path}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const initialTag = parseTag(slug);

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["notes", 1, 12, "", initialTag ?? ""],
    queryFn: ({ signal }) =>
      initialTag
        ? fetchNotes(1, 12, { search: "", tag: initialTag }, signal)
        : fetchNotes(1, 12, { search: "" }, signal),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient initialTag={initialTag} />
    </HydrationBoundary>
  );
}
