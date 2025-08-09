import { test, expect } from '@playwright/test';

const cards = [
  { name:/Entire Villa/i, guests:/16–24 guests|16-24 guests/i },
  { name:/Master Family Suite/i, guests:/6 guests/i },
  { name:/Triple\/Twin Rooms/i, guests:/3–4 guests|3-4 guests/i },
  { name:/Group Room/i, guests:/6 guests/i },
];

for (const route of ['/', '/accommodation']) {
  test(`${route} cards & pricing`, async ({ page }) => {
    await page.goto(route);
    for (const c of cards) {
      const card = page.getByRole('heading', { name: c.name }).locator('..');
      await expect(card.getByText(c.guests)).toBeVisible();
      await expect(card.getByText(/Airbnb:\s*\$/i)).toBeVisible();
      await expect(card.getByText(/Save\s+\$|Save\s+\d+%/i)).toBeVisible();
      await expect(card.getByRole('link', { name: /Open on Airbnb/i })).toBeVisible();
      await expect(card.getByRole('link', { name: /Book Direct/i })).toBeVisible();
    }
  });
}