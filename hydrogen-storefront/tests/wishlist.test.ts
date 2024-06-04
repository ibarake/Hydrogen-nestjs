import {test, expect} from '@playwright/test';

test.describe('Wishlist', () => {
  test('test if button is rendered', async ({page}) => {
    // Navigate to wishlist page
    await page.goto(`/products/the-full-stack?Size=154cm&Color=Syntax`);
    await expect(page.locator(".wishlist-btn")).toBeVisible();
  });

  test('test if button is clickable', async ({page}) => {
    
    // Navigate to wishlist page
    await page.goto(`/products/the-full-stack?Size=154cm&Color=Syntax`);
    // Add first item to wishlist
    await page.locator(`#wishlist-add button[type="submit"]`).click();

  });

  test('test if item is added to wishlist', async ({page}) => {
    // Navigate to wishlist page
    await page.goto(`/products/the-full-stack?Size=154cm&Color=Syntax`);
    // Add first item to wishlist
    await page.locator(`#wishlist-add button[type="submit"]`).click();
    // Navigate to wishlist page
    await page.goto(`/pages/wishlist`);
    await expect(page.locator("tr#the-full-stack")).toBeVisible();
  });
});