import { test, expect } from '@playwright/test';

test('Multiple tabs/windows handling', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.fabindia.com/');
    await page.getByPlaceholder('Search here...').nth(0).fill('Blue Cotton Slim Fit Shirt');
    await page.keyboard.press('Enter');

    const pagePromise = context.waitForEvent('page');
    page.getByAltText('Blue Cotton Slim Fit Shirt').first().click() 
    const newPage = await pagePromise;
    
    await newPage.locator('.custom_size_box').getByText('M', { exact: true }).click();
    await page.waitForTimeout(1000);

    await newPage.getByText('Add to cart ').click();
    await newPage.getByRole('link', { name: 'items currently in your cart' }).click();
    await  expect(newPage.getByRole('heading', { name: 'Blue Cotton Slim Fit Shirt'})).toBeVisible();
    await newPage.close();
    await expect(page).toHaveURL('https://www.fabindia.com/search?query=Blue%20Cotton%20Slim%20Fit%20Shirt');
});

test('Handling Alert', async ({page})=>{
    await page.goto('https://demoqa.com/alerts');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert')
        expect(dialog.message()).toContain('You clicked a button')
        await dialog.accept();
    })
    await page.locator('#alertButton').click();
})

test('Handling Confirm', async ({page})=>{
    await page.goto('https://demoqa.com/alerts');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('Do you confirm action?')
        await dialog.accept();
    })
    await page.locator('#confirmButton').click();
})

test('Handling Prompt', async ({page})=>{
    await page.goto('https://demoqa.com/alerts');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt')
        expect(dialog.message()).toContain('Please enter your name')
        await dialog.accept('Chandresh');
    })
    await page.locator('#promtButton').click();
})

test("Handling Nested iFrame", async ({page}) => {
    await page.goto("https://demoqa.com/nestedframes");
    
    const frameExa = page.frameLocator("#frame1");
    const nestedFrame = frameExa.frameLocator("iframe[srcdoc]");

    console.log(await nestedFrame.locator("p").innerText());
});