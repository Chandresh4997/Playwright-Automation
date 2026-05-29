import { test, expect } from '@playwright/test';

test.only('test2', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
  await page.getByRole('link', { name: '+' }).nth(1).click();
  await page.getByRole('button', { name: 'ADD TO CART' }).nth(1).click();
  await page.locator('div:nth-child(15) > .product-action > button').click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
  await expect(page.locator('tbody')).toContainText('Cauliflower - 1 Kg');
  await expect(page.locator('tbody')).toContainText('Apple - 1 Kg');
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.getByRole('combobox').selectOption('India');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Proceed' }).click();
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
});