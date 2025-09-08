'use client';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: ({ signal }) => fetchNoteById(id, signal),
    refetchOnMount: false,
  });

  const close = () => router.back();

  return (
    <Modal onClose={close}>
      {isLoading ? (
        <p>Loading, please wait...</p>
      ) : isError || !data ? (
        <p>Something went wrong.</p>
      ) : (
        <div className={css.container}>
          <button className={css.backBtn} onClick={close}>
            ← Back
          </button>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{data.title}</h2>
              <span className={css.tag} title={data.tag}>
                {data.tag}
              </span>
            </div>
            <p className={css.content}>{data.content}</p>
            <p className={css.date}>
              {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
