export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export type BoardState = Column[];

export type BoardAction =
  | { type: "renameColumn"; columnId: string; title: string }
  | { type: "addCard"; columnId: string; card: Card }
  | { type: "deleteCard"; cardId: string }
  | { type: "moveCard"; cardId: string; toColumnId: string; toIndex: number };

export function findColumnOfCard(board: BoardState, cardId: string) {
  return board.find((column) => column.cards.some((card) => card.id === cardId));
}

export function boardReducer(board: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "renameColumn":
      return board.map((column) =>
        column.id === action.columnId ? { ...column, title: action.title } : column,
      );
    case "addCard":
      return board.map((column) =>
        column.id === action.columnId
          ? { ...column, cards: [...column.cards, action.card] }
          : column,
      );
    case "deleteCard":
      return board.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== action.cardId),
      }));
    case "moveCard": {
      const card = findColumnOfCard(board, action.cardId)!.cards.find(
        (c) => c.id === action.cardId,
      )!;
      const without = boardReducer(board, { type: "deleteCard", cardId: action.cardId });
      return without.map((column) => {
        if (column.id !== action.toColumnId) return column;
        const cards = [...column.cards];
        cards.splice(action.toIndex, 0, card);
        return { ...column, cards };
      });
    }
  }
}

export const initialBoard: BoardState = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "c1", title: "Competitor research", details: "Review the top five tools and note pricing and positioning." },
      { id: "c2", title: "Onboarding emails", details: "Draft a three-step welcome sequence for new sign-ups." },
      { id: "c3", title: "Accessibility audit", details: "Check contrast, focus order and screen reader labels." },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: "c4", title: "Pricing page copy", details: "Clarify the difference between the Starter and Team plans." },
      { id: "c5", title: "Set up analytics", details: "Track sign-ups and activation on the landing page." },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      { id: "c6", title: "Dashboard redesign", details: "New layout with a cleaner navigation and summary tiles." },
      { id: "c7", title: "API rate limiting", details: "Add per-key limits and return helpful error messages." },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [
      { id: "c8", title: "Mobile navigation", details: "Collapsible menu for small screens, ready for QA." },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: "c9", title: "Brand guidelines", details: "Colors, type scale and logo usage documented." },
      { id: "c10", title: "Customer interviews", details: "Twelve interviews completed and summarized." },
    ],
  },
];
