import { test, expect } from '@playwright/test';

test('Assertions', async ({ page }) => {
    await page.goto("https://www.patanjaliayurved.net/")
    
    await page.getByRole('button', { name: '×' }).click();
    await page.locator('.users-icon').click();
    await expect.soft(page.locator('#loginemail')).toBeEmpty();
    await page.locator('#loginemail').fill("chandreshthakkar9090@gmail.com");
    await expect.soft(page.locator('#loginpassword')).toBeEmpty();
    await page.locator('#loginpassword').fill("Chandresh@1105");
    await page.waitForLoadState('load');
    await page.locator('#login_button').click();
    await page.getByRole('button', { name: '×' }).click();
    await page.getByRole('heading', { name: 'Personal Care' }).nth(0).click();
    await expect(page.getByRole('heading', { name: "Patanjali Dant Kanti Aloevera Gel Toothpaste " })).toBeVisible();
    await page.getByRole('heading', { name: "Patanjali Dant Kanti Aloevera Gel Toothpaste " }).click();
    await page.waitForEvent('load');
    await page.locator('#btn-add-cart937').click();
    await page.waitForLoadState('load');
    await page.locator('[class="sinlge-bar shopping"]').hover();
    await page.locator('[class="shopping-item"] [href="https://www.patanjaliayurved.net/checkout"]').first().click({force: true});
    await expect(page).toHaveURL('https://www.patanjaliayurved.net/checkout');
})