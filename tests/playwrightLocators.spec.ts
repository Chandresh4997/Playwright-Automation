import { test, expect } from '@playwright/test';

test('abc', async ({ page }) => {
    await page.goto('https://www.fabindia.com/');
    await page.getByPlaceholder('Search here...').nth(0).fill('shirt');
    await page.keyboard.press('Enter');

    const [newPage] = await Promise.all([
        page.context().waitForEvent('page'), // listens for new tab
        page.getByAltText('Blue Cotton Slim Fit Shirt').click() // action that opens new tab
    ]);
    await newPage.locator('.custom_size_box').getByText('M', { exact: true }).click();
    await newPage.getByText('Add to cart ').click();
    expect(newPage.getByRole('heading', { name: 'Blue Cotton Slim Fit Shirt'})).toBeVisible();
});