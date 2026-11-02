import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("all seven screens render without runtime errors or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of [
    "/",
    "/dashboard",
    "/command-center",
    "/warranty-vault",
    "/scan",
    "/lexibot",
    "/research",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Opening your workspace…")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/dashboard");
  await expect(page.getByText("Studio Headphones Pro").first()).toBeVisible();
  await page.screenshot({
    path: "test-results/overview-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(errors).toEqual([]);
});

test("case creation, notice export, response tracking, and resolution persist", async ({
  page,
}) => {
  await page.goto("/command-center");
  await page.getByRole("button", { name: "New case", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Your full name").fill("Jordan Avery");
  await dialog.getByLabel("Merchant", { exact: true }).fill("Test Merchant");
  await dialog.getByLabel("Product", { exact: true }).fill("Test Desk Lamp");
  await dialog.getByLabel("Requested refund (USD)").fill("59.95");
  const narrative =
    "The desk lamp stopped working during normal use after one week. I am requesting a refund.";
  await dialog.getByLabel("What happened?").fill(narrative);
  await dialog.getByRole("button", { name: "Create draft" }).click();
  await expect(dialog).toHaveCount(0);
  await page
    .getByRole("button", { name: "Test Desk Lamp", exact: true })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Export draft" }).click();
  const download = await downloadPromise;
  expect(await readFile((await download.path())!, "utf-8")).toContain(
    narrative,
  );
  expect(await readFile((await download.path())!, "utf-8")).toContain("$59.95");
  await dialog.getByRole("button", { name: "Record as sent" }).click();
  await expect(
    dialog.getByText("Awaiting response", { exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(
    page.getByRole("row").filter({ hasText: "Test Desk Lamp" }),
  ).toContainText("15 days remaining");
  await page.reload();
  await page
    .getByRole("button", { name: "Test Desk Lamp", exact: true })
    .click();
  await dialog.getByRole("button", { name: "Mark resolved" }).click();
  await expect(dialog.getByText("Resolved", { exact: true })).toBeVisible();
});

test("product passport stores evidence and transfers it into a draft case", async ({
  page,
}) => {
  await page.goto("/warranty-vault");
  await page.getByRole("button", { name: "Add purchase", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Product name").fill("Test Coffee Grinder");
  await dialog.getByLabel("Brand", { exact: true }).fill("Test Brand");
  await dialog.getByLabel("Category").selectOption("Home");
  await dialog.getByLabel("Purchased from").fill("Test Shop");
  await dialog.getByLabel("Purchase price (USD)").fill("80");
  await dialog.getByRole("button", { name: "Add to my vault" }).click();
  await page
    .getByRole("button", { name: "Open passport for Test Coffee Grinder" })
    .click();
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jF1kAAAAASUVORK5CYII=",
    "base64",
  );
  await dialog
    .getByLabel("Attach a receipt or warranty document")
    .setInputFiles({ name: "receipt.png", mimeType: "image/png", buffer: png });
  await expect(
    dialog.getByRole("button", { name: "Download receipt.png" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Open passport for Test Coffee Grinder" })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Download receipt.png" }).click();
  expect(await readFile((await (await downloadPromise).path())!)).toEqual(png);
  await dialog
    .getByRole("button", { name: "Prepare a warranty request" })
    .click();
  await dialog
    .getByRole("button", { name: "Move to the command center" })
    .click();
  await dialog.getByLabel("Your full name").fill("Jordan Avery");
  await dialog
    .getByLabel("What’s the issue?")
    .fill(
      "The grinder motor stopped operating. The merchant declined my service request.",
    );
  await dialog.getByRole("button", { name: "Create draft case" }).click();
  await expect(page).toHaveURL(/command-center/);
  await page
    .getByRole("button", { name: "Test Coffee Grinder", exact: true })
    .click();
  await expect(dialog.locator("pre")).toContainText("receipt.png — SHA-256:");
});

test("contract screening returns verbatim citations and supports a second audit", async ({
  page,
}) => {
  await page.goto("/lexibot");
  await page.getByRole("button", { name: "Try sample terms" }).click();
  await page.getByRole("button", { name: "Review the terms" }).click();
  await expect(
    page.getByText("9 sentences reviewed across 5 axes.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mandatory arbitration" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Can I cancel?", exact: true })
    .click();
  await expect(page.locator(".chat-citation").first()).toContainText(
    "[S-008] “You may cancel your subscription at any time from your account settings.”",
  );
  await page
    .getByRole("textbox", { name: "Contract text" })
    .fill(
      "You may contact the service team for help. We offer technical support every weekday.",
    );
  await page.getByRole("button", { name: "Review the terms" }).click();
  await expect(
    page.getByText("No keyword matches found.", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".chat-citation")).toHaveCount(0);
});

test("scanner rejects bad checksums and allows manual entry for unlisted products", async ({
  page,
}) => {
  await page.route("**/api/scan/*", (route) =>
    route.fulfill({
      json: {
        barcode: "4006381333931",
        status: "not_found",
        product: null,
        sources: [{ name: "UPCitemDB", status: "not_found" }],
      },
    }),
  );
  await page.goto("/scan");
  await page.getByLabel("Barcode or GS1 Digital Link").fill("5901234123458");
  await page.getByRole("button", { name: "Look up product" }).click();
  await expect(page.locator(".form-error")).toContainText("check digit");
  await page.getByLabel("Barcode or GS1 Digital Link").fill("4006381333931");
  await page.getByRole("button", { name: "Look up product" }).click();
  await expect(
    page.getByRole("heading", { name: "This product isn’t listed yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add product manually" }).click();
  await expect(page.getByLabel("Product barcode (optional)")).toHaveValue(
    "4006381333931",
  );
});

test("mobile screens fit and navigation and dialog keyboard controls work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/dashboard",
    "/command-center",
    "/warranty-vault",
    "/scan",
    "/lexibot",
    "/research",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Opening your workspace…")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/dashboard");
  await page.screenshot({
    path: "test-results/overview-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Warranty vault", exact: true }).click();
  await expect(page).toHaveURL(/warranty-vault/);
  await page.getByRole("button", { name: "Add purchase", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Add purchase", exact: true }),
  ).toBeFocused();
});

test("fresh workspace replaces fictional records and research filtering works", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Studio Headphones Pro").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Workspace settings", exact: true })
    .click();
  await page.getByRole("button", { name: "Start a fresh workspace" }).click();
  await expect(
    page.getByText("Your purchases belong here.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Your purchases belong here.", { exact: true }),
  ).toBeVisible();
  await page.goto("/research");
  await page
    .getByRole("button", { name: "Warranty rights", exact: true })
    .click();
  await expect(
    page.getByText("2 sources to explore", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search research library").fill("nonexistent-author");
  await expect(
    page.getByText("A different search might help.", { exact: true }),
  ).toBeVisible();
});

test("EvolveAI-inspired landing has working toolkit navigation and expandable FAQ", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Hackops consumer rights workspace" }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Open workspace", exact: true }),
  ).toHaveCount(1);
  await page
    .getByRole("button", { name: "Will Hackops send a notice on my behalf?" })
    .click();
  await expect(
    page.getByText("You stay in control.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Will Hackops send a notice on my behalf?" })
    .click();
  await expect(page.locator("#faq-answer-1")).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/landing-desktop.png",
    animations: "disabled",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/landing-mobile.png",
    animations: "disabled",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Landing page navigation" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Landing page navigation" }).getByRole("link", { name: "Home", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Landing page navigation" })).toBeHidden();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "The toolkit", exact: true }).click();
  await expect(page).toHaveURL(/#features$/);
  await expect(
    page.locator('#landing-navigation a[href="#features"]'),
  ).toHaveAttribute("aria-current", "location");
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
  await page
    .getByRole("link", { name: "Try product scanner", exact: false })
    .click();
  await expect(page).toHaveURL(/\/scan$/);
});
