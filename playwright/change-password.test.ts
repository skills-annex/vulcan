import { expect, test } from "@playwright/test";

// Using logged in state from globalSteup
test.use({ storageState: "playwright/artifacts/proStorageState.json" });

test("change password", async ({ page }) => {
  // Try to go homepage
  await page.goto("/");
  // It should redirect you to the bookings page
  await page.waitForSelector("[data-testid=bookings]");

  // Go to http://localhost:3000/settings/security
  await page.goto("/settings/security");

  // Fill form
  await page.fill('[name="current_password"]', "pro");
  await page.fill('[name="new_password"]', "pro1");
  await page.press('[name="new_password"]', "Enter");

  expect(page.locator(`text=Your password has been successfully changed.`)).toBeTruthy();

  // Let's revert back to prevent errors on other tests
  await page.fill('[name="current_password"]', "pro1");
  await page.fill('[name="new_password"]', "pro");
  await page.press('[name="new_password"]', "Enter");

  expect(page.locator(`text=Your password has been successfully changed.`)).toBeTruthy();
});
