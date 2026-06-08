import { test, expect } from "@playwright/test";
import { HimTrekHomePage } from '../pages/himtrekHome';

test.beforeEach(async ({ page }) => {
    const placeHome = new HimTrekHomePage(page);
    
    await placeHome.himtrekURL();
    await placeHome.login(process.env.USERNAME!, process.env.PASSWORD!);
})

test.afterEach(async ({ page }) => {
    const placeHome = new HimTrekHomePage(page);
    await placeHome.logout();
})

test('Browsing Brahmatal Trek, Uttarakhand from Navigation Menu @smoke', async ({ page }) => {
    await page.locator('#menu-item-14485').hover();
    await page.locator('#menu-item-14804').hover();
    await page.locator('#menu-item-20558').click();
    await expect(page.getByRole('heading', {name: 'Brahmatal Trek, Uttarakhand'})).toContainText('Brahmatal Trek, Uttarakhand');
})

test.skip('View User Profile @ui', async ({ page }) => {
    await page.locator('#dropdown-dashboard').click();
    await page.getByRole('link', {name: "Dashboard"}).click();
    await expect(page.locator('.user-name')).toContainText('Chandresh Thakkar');
})

test('Browse Himtrek For Corporates @ui', async ({ page }) => {
    await page.locator('.elementor-button-text').first().click();
    await expect(page.locator('.banner-content')).toContainText('Corporate Trips');
})

test('View Terms and Conditions @regression', async ({page}) => {
    await page.getByRole('link', {name: 'Terms and Conditions'}).click();
    await expect(page.locator('.e-con-inner')).toContainText('Terms and Conditions');
})