import { expect, test } from "@playwright/test";

// Using logged in state from globalSteup
test.use({ storageState: "playwright/artifacts/trialStorageState.json" });

test("Trial banner should be visible to TRIAL users", async ({ page }) => {
  // Try to go homepage
  await page.goto("/");
  // It should redirect you to the bookings page
  await page.waitForSelector("[data-testid=bookings]");

  await expect(page.locator(`[data-testid=trial-banner]`)).toBeVisible();
});
