"use client";

import { useState, type Dispatch } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { BoardAction, Column as ColumnType } from "@/lib/board";
import SortableCard from "./Card";
import AddCardForm from "./AddCardForm";

type Props = {
  column: ColumnType;
  dispatch: Dispatch<BoardAction>;
};

export default function Column({ column, dispatch }: Props) {
  const [editing, setEditing] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function save(value: string) {
    const title = value.trim();
    if (title) dispatch({ type: "renameColumn", columnId: column.id, title });
    setEditing(false);
  }

  return (
    <section
      data-testid="column"
      aria-label={column.title}
      className="flex w-72 shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-slate-50/80 shadow-sm"
    >
      <div className="h-1 rounded-t-2xl bg-accent" />
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        {editing ? (
          <input
            autoFocus
            aria-label="Column name"
            defaultValue={column.title}
            onBlur={(e) => save(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save(e.currentTarget.value);
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-full rounded-md border border-primary bg-white px-2 py-1 text-sm font-semibold text-navy outline-none ring-2 ring-primary/20"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Rename column"
            className="truncate rounded-md px-2 py-1 text-left text-sm font-semibold text-navy transition hover:bg-white"
          >
            {column.title}
          </button>
        )}
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {column.cards.length}
        </span>
      </div>
      <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`mx-2 flex min-h-24 flex-1 flex-col gap-2.5 rounded-xl p-2 transition-colors ${
            isOver ? "bg-primary/5" : ""
          }`}
        >
          {column.cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              onDelete={() => dispatch({ type: "deleteCard", cardId: card.id })}
            />
          ))}
        </div>
      </SortableContext>
      <div className="p-3">
        <AddCardForm
          onAdd={(title, details) =>
            dispatch({
              type: "addCard",
              columnId: column.id,
              card: { id: crypto.randomUUID(), title, details },
            })
          }
        />
      </div>
    </section>
  );
}
