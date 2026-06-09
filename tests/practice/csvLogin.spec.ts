import { test, expect } from '@playwright/test';
import { readCsv } from '../../utils/readCsv';
import testFile from '../../data/testFile.json';

let users: any[];

test.beforeAll(async () => {
  users = await readCsv('data/Test_Data.csv');
  console.log(users);
});

test('Login test using CSV data', async ({ page }) => {
  for (const user of users) {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill(user.username);
    await page.locator('#password').fill(user.password);
    await page.locator('#login-button').click();
    await expect(page.locator('.app_logo')).toContainText('Swag Labs');
    await page.pause();
    console.log(`Login tested for: ${user.username}`);
  }
});

test('Login test using JSON data', async ({ page }) => {
  for (const user of testFile) {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill(user.username);
    await page.locator('#password').fill(user.password);
    await page.locator('#login-button').click();
    await expect(page.locator('.app_logo')).toContainText('Swag Labs');
    await page.pause();
    console.log(`Login tested for: ${user.username}`);
  }
});