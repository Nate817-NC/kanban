import { expect, test, type Locator, type Page } from "@playwright/test";

const column = (page: Page, name: string) => page.getByRole("region", { name });
const cards = (col: Locator) => col.getByTestId("card");

async function drag(page: Page, from: Locator, to: Locator) {
  const a = (await from.boundingBox())!;
  const b = (await to.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2, { steps: 5 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 20 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("column")).toHaveCount(5);
});

test("loads the board with dummy data", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Product Launch" })).toBeVisible();
  await expect(page.getByTestId("card")).toHaveCount(10);
  for (const name of ["Backlog", "To Do", "In Progress", "Review", "Done"]) {
    await expect(column(page, name)).toBeVisible();
  }
});

test("renames a column", async ({ page }) => {
  await page.getByRole("button", { name: "In Progress" }).click();
  await page.getByRole("textbox", { name: "Column name" }).fill("Doing");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Doing" })).toBeVisible();
  await expect(column(page, "Doing")).toBeVisible();
});

test("adds a card", async ({ page }) => {
  const done = column(page, "Done");
  await done.getByRole("button", { name: /add card/i }).click();
  await done.getByRole("textbox", { name: "Card title" }).fill("Launch party");
  await done.getByRole("textbox", { name: "Card details" }).fill("Book the venue");
  await done.getByRole("button", { name: "Add card" }).click();
  await expect(cards(done)).toHaveCount(3);
  await expect(cards(done).last()).toContainText("Launch party");
  await expect(cards(done).last()).toContainText("Book the venue");
});

test("deletes a card", async ({ page }) => {
  const card = page.getByTestId("card").filter({ hasText: "Pricing page copy" });
  await card.hover();
  await card.getByRole("button", { name: "Delete Pricing page copy" }).click();
  await expect(page.getByText("Pricing page copy")).toHaveCount(0);
  await expect(cards(column(page, "To Do"))).toHaveCount(1);
});

test("drags a card to another column", async ({ page }) => {
  const backlog = column(page, "Backlog");
  const review = column(page, "Review");
  await drag(page, cards(backlog).first(), cards(review).first());
  await expect(cards(backlog)).toHaveCount(2);
  await expect(cards(review)).toHaveCount(2);
  await expect(review).toContainText("Competitor research");
});

test("drags a card into an emptied column", async ({ page }) => {
  const review = column(page, "Review");
  await page.getByTestId("card").filter({ hasText: "Mobile navigation" }).hover();
  await page.getByRole("button", { name: "Delete Mobile navigation" }).click();
  await expect(cards(review)).toHaveCount(0);
  await drag(page, cards(column(page, "Done")).first(), review);
  await expect(cards(review)).toHaveCount(1);
  await expect(review).toContainText("Brand guidelines");
});

test("reorders cards within a column", async ({ page }) => {
  const backlog = column(page, "Backlog");
  await drag(page, cards(backlog).first(), cards(backlog).last());
  await expect(cards(backlog).last()).toContainText("Competitor research");
  await expect(cards(backlog).first()).toContainText("Onboarding emails");
});

test("moves a card with the keyboard", async ({ page }) => {
  const todo = column(page, "To Do");
  await cards(todo).first().focus();
  for (const key of ["Space", "ArrowDown", "Space"]) {
    await page.keyboard.press(key);
    await page.waitForTimeout(200);
  }
  await expect(cards(todo).last()).toContainText("Pricing page copy");
});
