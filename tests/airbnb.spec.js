import { test, expect } from '@playwright/test';

const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/get-otp';
const OTP_WAIT_MS = 20000;

async function getOTPFromN8N() {
    console.log(`Waiting ${OTP_WAIT_MS / 1000}s for OTP email to arrive...`);
    await new Promise(resolve => setTimeout(resolve, OTP_WAIT_MS));

    const response = await fetch(N8N_WEBHOOK_URL);

    if (!response.ok) {
        throw new Error(`n8n webhook failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw n8n response:', JSON.stringify(data));

    const otp = data.otp || data.json?.otp;

    if (!otp) {
        throw new Error('OTP not found in response: ' + JSON.stringify(data));
    }

    return otp;
}

test('Yatra OTP Login', async ({ page }) => {

    await page.goto('https://www.yatra.com/');
    await page.getByText('Login / Signup').click();
    await page.locator('#mobile-number').fill('chandresht5278@gmail.com');
    await page.getByText('Login', { exact: true }).click();
    await page.getByText('OR Login using OTP').click();

    console.log('Calling n8n to get OTP...');
    const otp = await getOTPFromN8N();
    console.log('OTP received from n8n:', otp);

    await page.locator('#otp').fill(otp);
    await page.getByText('Verify', { exact: true }).click();
    console.log('Login successful!');
    await page.pause();
});