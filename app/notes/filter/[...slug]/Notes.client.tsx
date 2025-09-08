"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";

export default function NotesPageClient({
  initialTag,
}: {
  initialTag?: NoteTag;
}) {
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearchQuery(value);
  }, 300);

  const { data, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, perPage, searchQuery, initialTag ?? ""],
    queryFn: ({ signal }) =>
      initialTag
        ? fetchNotes(
            page,
            perPage,
            { search: searchQuery, tag: initialTag },
            signal
          )
        : fetchNotes(page, perPage, { search: searchQuery }, signal),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.container ?? css.app}>
      <header className={css.toolbar}>
        <SearchBox text={searchQuery} onSearch={debouncedSetSearch} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isError && <p>{(error as Error)?.message ?? "Error"}</p>}

      {data &&
        (data.notes.length === 0 ? (
          <p>No notes found</p>
        ) : (
          <NoteList notes={data.notes} />
        ))}

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
