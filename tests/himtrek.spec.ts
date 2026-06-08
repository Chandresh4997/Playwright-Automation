import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../pages/himtrekHome';

test('himtrek flow', async ({ page }) => {

    const placeHome = new HimTrekHomePage(page)

    await placeHome.himtrekURL();
    await placeHome.login('chandresh4997', 'Chandresh@1105');

    // await page.goto('https://himtrek.co.in/');
    // await page.getByRole('link', {name: "Login"}).click();
    // await page.getByRole('textbox', { name: 'Email or Username' }).fill('chandresh4997');
    // await page.getByRole('textbox', { name: 'Password' }).fill('Chandresh@1105');
    // await page.getByRole('button', { name: 'Log in' }).click();
    // // await expect(page)    Logged in successfully
    // await page.locator('#location_name_activity').fill('Uttarakhand');
    // await page.locator('.form-date-field').click();
    // await page.locator('div.date').filter({ hasText: '26' }).first().click();
    // await page.locator('div.date').filter({ hasText: '28' }).first().click();
    // await page.getByRole('button', {name: 'Search'}).click();
    // await page.getByRole('link', {name: 'Ali Bedni Bugyal Trek'}).first().click();
})