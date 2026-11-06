"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/lib/board";

type ViewProps = {
  card: Card;
  dragging?: boolean;
  onDelete?: () => void;
};

export function CardView({ card, dragging, onDelete }: ViewProps) {
  return (
    <div
      className={`group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition ${
        dragging
          ? "rotate-2 cursor-grabbing shadow-xl ring-2 ring-primary/30"
          : "cursor-grab hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <h3 className="pr-6 text-sm font-semibold text-navy">{card.title}</h3>
      {card.details && <p className="mt-1.5 text-xs leading-relaxed text-muted">{card.details}</p>}
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${card.title}`}
          onClick={onDelete}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 rounded-md p-1 text-muted opacity-0 transition group-hover:opacity-100 hover:bg-secondary/10 hover:text-secondary focus:opacity-100"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function SortableCard({ card, onDelete }: { card: Card; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      data-testid="card"
      aria-label={card.title}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-40" : ""}
      {...attributes}
      {...listeners}
    >
      <CardView card={card} onDelete={onDelete} />
    </div>
  );
}
