import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';

test('himtrek flow', async ({ page }) => {

    const placeHome = new HimTrekHomePage(page)

    await placeHome.himtrekURL();
    await placeHome.login(process.env.USERNAME!,process.env.PASSWORD!);
})