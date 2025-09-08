'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NotePreview.module.css';

export default function NotePreview({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: ({ signal }) => fetchNoteById(id, signal),
  });

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (isError || !data)
    return <div className={css.error}>Failed to load note</div>;

  return (
    <article className={css.note}>
      <h2 className={css.title}>{data.title}</h2>
      <p className={css.meta}>Tag: {data.tag}</p>
      <div className={css.content}>{data.content}</div>
    </article>
  );
}
