'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { NoteTag } from '@/types/note';
import css from './TagsMenu.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className={css.menuContainer} onMouseLeave={() => setOpen(false)}>
      <button
        className={css.menuButton}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Notes ▾
      </button>
      <ul className={`${css.menuList} ${open ? css.open : ''}`} role="menu">
        <li className={css.menuItem} role="none">
          <Link className={css.menuLink} href="/notes/filter/All" role="menuitem" onClick={() => setOpen(false)}>
            All notes
          </Link>
        </li>
        {TAGS.map(tag => (
          <li className={css.menuItem} key={tag} role="none">
            <Link
              className={css.menuLink}
              href={`/notes/filter/${encodeURIComponent(tag)}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
