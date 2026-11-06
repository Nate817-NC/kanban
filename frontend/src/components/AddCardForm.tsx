"use client";

import { useState, type FormEvent } from "react";

export default function AddCardForm({ onAdd }: { onAdd: (title: string, details: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function close() {
    setOpen(false);
    setTitle("");
    setDetails("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    onAdd(title.trim(), details.trim());
    close();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white hover:text-primary"
      >
        <span className="text-lg leading-none">+</span> Add card
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <input
        autoFocus
        aria-label="Card title"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && close()}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-navy outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <textarea
        aria-label="Card details"
        placeholder="Details"
        rows={3}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && close()}
        className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm text-navy outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add card
        </button>
        <button type="button" onClick={close} className="px-3 py-2 text-sm text-muted transition hover:text-navy">
          Cancel
        </button>
      </div>
    </form>
  );
}
