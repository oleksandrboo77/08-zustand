"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNoteInput } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: (payload: CreateNoteInput) => createNote(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const createAction = async (formData: FormData) => {
    const payload: CreateNoteInput = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      tag: String(formData.get("tag") ?? "Todo") as NoteTag,
    };
    await mutation.mutateAsync(payload);
  };

  return (
    <form className={css.form} action={createAction}>
      <label className={css.label}>
        <span className={css.labelText}>Title</span>
        <input
          className={css.input}
          type="text"
          name="title"
          required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          placeholder="Enter title"
        />
      </label>

      <label className={css.label}>
        <span className={css.labelText}>Content</span>
        <textarea
          className={css.textarea}
          name="content"
          maxLength={500}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          placeholder="Enter content..."
        />
      </label>

      <label className={css.label}>
        <span className={css.labelText}>Tag</span>
        <select
          className={css.select}
          name="tag"
          value={draft.tag ?? "Todo"}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </label>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating…" : "Create note"}
        </button>
      </div>
    </form>
  );
}
