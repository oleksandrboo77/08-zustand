import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export type Draft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteState = {
  draft: Draft;
  setDraft: (next: Partial<Draft> | Draft) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (next) => {
        const current = get().draft;
        const updated =
          typeof next === "object" && !Array.isArray(next)
            ? { ...current, ...next }
            : (next as Draft);
        set({ draft: updated });
      },
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-draft",
      version: 1,

      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
