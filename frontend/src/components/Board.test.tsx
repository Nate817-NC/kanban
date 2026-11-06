import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Board from "./Board";

const column = (name: string) => screen.getByRole("region", { name });

describe("Board", () => {
  it("renders five columns with dummy cards", () => {
    render(<Board />);
    expect(screen.getAllByTestId("column")).toHaveLength(5);
    expect(screen.getByText("Competitor research")).toBeInTheDocument();
    expect(within(column("Backlog")).getAllByTestId("card")).toHaveLength(3);
  });

  it("renames a column with Enter", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "Backlog" }));
    const input = screen.getByRole("textbox", { name: "Column name" });
    await user.clear(input);
    await user.type(input, "Ideas{Enter}");
    expect(screen.getByRole("button", { name: "Ideas" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Backlog" })).not.toBeInTheDocument();
  });

  it("cancels a rename with Escape", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "Review" }));
    await user.type(screen.getByRole("textbox", { name: "Column name" }), " changed{Escape}");
    expect(screen.getByRole("button", { name: "Review" })).toBeInTheDocument();
  });

  it("keeps the old name when the new one is blank", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "Done" }));
    await user.clear(screen.getByRole("textbox", { name: "Column name" }));
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
  });

  it("adds a card to a column", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const todo = column("To Do");
    await user.click(within(todo).getByRole("button", { name: /add card/i }));
    await user.type(within(todo).getByRole("textbox", { name: "Card title" }), "Write tests");
    await user.type(within(todo).getByRole("textbox", { name: "Card details" }), "Cover the reducer");
    await user.click(within(todo).getByRole("button", { name: "Add card" }));
    expect(within(todo).getByText("Write tests")).toBeInTheDocument();
    expect(within(todo).getByText("Cover the reducer")).toBeInTheDocument();
    expect(within(todo).getAllByTestId("card")).toHaveLength(3);
  });

  it("does not add a card without a title", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const todo = column("To Do");
    await user.click(within(todo).getByRole("button", { name: /add card/i }));
    expect(within(todo).getByRole("button", { name: "Add card" })).toBeDisabled();
    await user.type(within(todo).getByRole("textbox", { name: "Card title" }), "   ");
    expect(within(todo).getByRole("button", { name: "Add card" })).toBeDisabled();
  });

  it("cancels adding a card", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const todo = column("To Do");
    await user.click(within(todo).getByRole("button", { name: /add card/i }));
    await user.click(within(todo).getByRole("button", { name: "Cancel" }));
    expect(within(todo).queryByRole("textbox", { name: "Card title" })).not.toBeInTheDocument();
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "Delete Mobile navigation" }));
    expect(screen.queryByText("Mobile navigation")).not.toBeInTheDocument();
    expect(within(column("Review")).queryAllByTestId("card")).toHaveLength(0);
  });
});
