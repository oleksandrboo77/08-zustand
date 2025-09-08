import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const base = "https://ac.goit.global/fullstack/react/";

  try {
    const note = await fetchNoteById(id);
    const snippet = (note.content ?? "").trim().slice(0, 140) || "Viewing note";
    const title = `${note.title} — NoteHub`;
    const description = snippet;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${base}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  } catch {
    const title = `Note — ${id} — NoteHub`;
    const description = "Viewing note.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${base}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
