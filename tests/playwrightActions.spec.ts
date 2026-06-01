import { test, expect } from '@playwright/test';

test('Sort By selection using Dropdown', async ({ page }) => {
    await page.goto('https://www.fabindia.com/clothing/men-short-kurtas?promoname=Short%20Kurtas&promoID=FabMenCategoryPageSection2ImagesComponent3');
    await page.locator('#select-filter').selectOption(' Price: Low to High ');
});

test('Material selection using Checkbox', async ({ page }) => {
    await page.goto('https://www.fabindia.com/clothing/men-short-kurtas?promoname=Short%20Kurtas&promoID=FabMenCategoryPageSection2ImagesComponent3');
    await page.getByRole('button', { name: 'Material' }).click();
    await page.getByLabel('Cotton').check();
    await page.getByLabel('Viscose').check();
    await expect(page.getByLabel('Cotton')).toBeChecked();
    await expect(page.getByLabel('Viscose')).toBeChecked();
});

test('Address selection using Radio Button', async ({ page }) => {
    await page.goto('https://www.fabindia.com/login/email');
    await page.getByRole('button', { name: 'Login using password' }).click();
    await page.getByPlaceholder('Enter Email Address').fill('chandreshthakkar9090@gmail.com');
    await page.getByPlaceholder('Password').fill('Chandresh@1105');
    await page.locator('.login-signup-mobile-btn').click();
    await page.waitForTimeout(1000);
    await page.locator('#searchBox').nth(0).fill('shirt');
    await page.keyboard.press('Enter');
    const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.getByAltText('Blue Cotton Slim Fit Shirt').click()
    ]);
    await newPage.locator('.custom_size_box').getByText('M', { exact: true }).click();
    await page.waitForTimeout(1000);
    await newPage.getByText('Add to cart ').click();
    await newPage.getByRole('link', { name: 'items currently in your cart' }).click();
    await newPage.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await newPage.locator('#savedAddress').nth(0).check();
    await expect(newPage.locator('#savedAddress').nth(0)).toBeChecked();
    await newPage.locator('#savedAddress').nth(1).check();
    await expect(newPage.locator('#savedAddress').nth(1)).toBeChecked();
    await page.pause();
});

test('Category selection using Mouse events', async ({ page }) => {
    await page.goto('https://www.fabindia.com/');
    await page.getByRole('link', { name: 'Home & Living' }).first().hover();
    await page.getByRole('link', { name: 'Vases' }).click();
    await page.pause();
});

test('Product search using Keyboard events', async ({ page }) => {
    await page.goto("https://www.fabindia.com/");
    await page.locator('#searchBox').nth(0).pressSequentially('shirt', { delay: 100 });
    await page.locator('#searchBox').nth(0).press('Control+KeyA');
    await page.locator('#searchBox').nth(0).pressSequentially('jeans', { delay: 100 });
    await page.keyboard.press('Enter');
    await page.pause();
});

test('Determining Date of Birth using Date Picker', async ({ page }) => {
    await page.goto('https://www.fabindia.com/login/email');
    await page.getByRole('button', { name: 'Login using password' }).click();
    await page.getByPlaceholder('Enter Email Address').fill('chandreshthakkar9090@gmail.com');
    await page.getByPlaceholder('Password').fill('Chandresh@1105');
    await page.locator('.login-signup-mobile-btn').click();
    await page.waitForTimeout(1000);
    await page.locator('app-fab-login-slot').getByRole('button').filter({ hasText: /^$/ }).hover();
    await page.getByRole('button', { name: 'Profile' }).click();
    await page.locator('.edit-prof-pend').click();
    await page.getByRole('textbox', { name: 'Date of birth' }).fill('2003-05-11');
    await page.getByRole('textbox', { name: 'Date of birth' }).blur();
    await page.getByRole('button', { name: 'Update Profile' }).click();
});