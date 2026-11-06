"use client";

import { useReducer, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { boardReducer, findColumnOfCard, initialBoard, type Card } from "@/lib/board";
import Column from "./Column";
import { CardView } from "./Card";

export default function Board() {
  const [board, dispatch] = useReducer(boardReducer, initialBoard);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function target(overId: string) {
    const column = board.find((c) => c.id === overId);
    if (column) return { column, index: column.cards.length };
    const owner = findColumnOfCard(board, overId)!;
    return { column: owner, index: owner.cards.findIndex((c) => c.id === overId) };
  }

  function handleDragStart({ active }: DragStartEvent) {
    const column = findColumnOfCard(board, String(active.id))!;
    setActiveCard(column.cards.find((c) => c.id === active.id)!);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const from = findColumnOfCard(board, String(active.id))!;
    const to = target(String(over.id));
    if (from.id !== to.column.id) {
      dispatch({ type: "moveCard", cardId: String(active.id), toColumnId: to.column.id, toIndex: to.index });
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCard(null);
    if (!over || active.id === over.id) return;
    const to = target(String(over.id));
    dispatch({ type: "moveCard", cardId: String(active.id), toColumnId: to.column.id, toIndex: to.index });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="px-8 pt-10 pb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Project board</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy">Product Launch</h1>
        <div className="mt-3 h-1 w-14 rounded-full bg-accent" />
        <p className="mt-4 text-sm text-muted">
          Drag cards between columns. Click a column name to rename it.
        </p>
      </header>
      <DndContext
        id="board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveCard(null)}
      >
        <main className="flex flex-1 gap-5 overflow-x-auto px-8 pb-10">
          {board.map((column) => (
            <Column key={column.id} column={column} dispatch={dispatch} />
          ))}
        </main>
        <DragOverlay>{activeCard && <CardView card={activeCard} dragging />}</DragOverlay>
      </DndContext>
    </div>
  );
}
