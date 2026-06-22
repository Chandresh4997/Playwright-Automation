const { test, expect } = require('@playwright/test');
const { getOtpCode } = require('./gmail-otp');

test('login with OTP', async ({ page }) => {

    await page.goto('https://www.yatra.com/');
    await page.getByText('Login / Signup').click();
    await page.locator('#mobile-number').fill('chandresht5278@gmail.com');
    await page.getByText('Login', { exact: true }).click();
    await page.getByText('OR Login using OTP').click();

    const sentTime = Math.floor(Date.now() / 1000); // for query filtering
    const otp = await getOtpCode({
        from: 'donotreply@yatra.com',
        subjectContains: 'Login OTP',
        sentAfter: sentTime,
    });

    await page.locator('#otp').fill(otp);
    await page.getByText('Verify', { exact: true }).click();
    console.log('Login successful!');
    await page.pause();
});