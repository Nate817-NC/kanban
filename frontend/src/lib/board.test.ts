import { describe, expect, it } from "vitest";
import { boardReducer, findColumnOfCard, initialBoard, type BoardState } from "./board";

const board: BoardState = [
  {
    id: "a",
    title: "A",
    cards: [
      { id: "1", title: "One", details: "" },
      { id: "2", title: "Two", details: "" },
      { id: "3", title: "Three", details: "" },
    ],
  },
  { id: "b", title: "B", cards: [{ id: "4", title: "Four", details: "" }] },
  { id: "c", title: "C", cards: [] },
];

const ids = (state: BoardState, columnId: string) =>
  state.find((c) => c.id === columnId)!.cards.map((card) => card.id);

describe("initialBoard", () => {
  it("has exactly five columns", () => {
    expect(initialBoard).toHaveLength(5);
  });

  it("has dummy cards in every column", () => {
    for (const column of initialBoard) expect(column.cards.length).toBeGreaterThan(0);
  });

  it("uses unique card ids", () => {
    const all = initialBoard.flatMap((c) => c.cards.map((card) => card.id));
    expect(new Set(all).size).toBe(all.length);
  });
});

describe("boardReducer", () => {
  it("renames a column", () => {
    const next = boardReducer(board, { type: "renameColumn", columnId: "b", title: "Bee" });
    expect(next[1].title).toBe("Bee");
    expect(next[0].title).toBe("A");
  });

  it("adds a card to the end of a column", () => {
    const card = { id: "5", title: "Five", details: "Details" };
    const next = boardReducer(board, { type: "addCard", columnId: "c", card });
    expect(next[2].cards).toEqual([card]);
  });

  it("deletes a card", () => {
    const next = boardReducer(board, { type: "deleteCard", cardId: "2" });
    expect(ids(next, "a")).toEqual(["1", "3"]);
  });

  it("reorders a card within a column", () => {
    const next = boardReducer(board, { type: "moveCard", cardId: "1", toColumnId: "a", toIndex: 2 });
    expect(ids(next, "a")).toEqual(["2", "3", "1"]);
  });

  it("moves a card to another column at an index", () => {
    const next = boardReducer(board, { type: "moveCard", cardId: "2", toColumnId: "b", toIndex: 0 });
    expect(ids(next, "a")).toEqual(["1", "3"]);
    expect(ids(next, "b")).toEqual(["2", "4"]);
  });

  it("moves a card into an empty column", () => {
    const next = boardReducer(board, { type: "moveCard", cardId: "4", toColumnId: "c", toIndex: 0 });
    expect(ids(next, "b")).toEqual([]);
    expect(ids(next, "c")).toEqual(["4"]);
  });

  it("does not mutate the original board", () => {
    const copy = structuredClone(board);
    boardReducer(board, { type: "moveCard", cardId: "1", toColumnId: "b", toIndex: 1 });
    expect(board).toEqual(copy);
  });

  it("finds the column of a card", () => {
    expect(findColumnOfCard(board, "4")?.id).toBe("b");
  });
});
