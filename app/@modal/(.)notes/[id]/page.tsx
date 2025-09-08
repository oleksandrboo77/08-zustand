import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreview from './NotePreview.client';

export default async function NotePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['note', id],
    queryFn: ({ signal }) => fetchNoteById(id, signal),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotePreview />
    </HydrationBoundary>
  );
}
