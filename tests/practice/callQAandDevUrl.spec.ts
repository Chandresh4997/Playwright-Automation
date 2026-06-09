import test from "@playwright/test"
import { ENV } from "../../config/env"

test('Check with both URL', async({page}) => {
    await page.goto(ENV.baseUrl!);
})