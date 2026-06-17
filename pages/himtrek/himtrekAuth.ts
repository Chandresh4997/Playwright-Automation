import { Page, Locator } from "@playwright/test";
import { queryResult } from "../../db/dbClient";
import fs from 'fs';
import path from 'path';

export class HimTrekAuthPage {
    page: Page;
    inputUsername: Locator;
    inputPassword: Locator;
    btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputUsername = page.getByRole('textbox', { name: 'Email or Username' });
        this.inputPassword = page.getByRole('textbox', { name: 'Password' });
        this.btnLogin = page.getByRole('button', { name: 'Log in' });
    }

    async login(username: string, password: string) {
        await this.inputUsername.fill(username);
        await this.inputPassword.fill(password);
        await this.btnLogin.click();
        await this.page.waitForSelector('.dropdown-user-dashboard', {
            state: 'visible',
            timeout: 10000,
        });

        // Save session to auth.json
        const authPath = 'data/auth.json';
        fs.mkdirSync(path.dirname(authPath), { recursive: true });
        await this.page.context().storageState({ path: authPath });

        // Optionally record user in local DB when ENABLE_DB=true
        const enableDb = process.env.ENABLE_DB === 'true';
        if (enableDb) {
            // Get the displayed name from UI after login
            const displayedName = await this.page
                .locator('.dropdown-user-dashboard')
                .innerText();

            // Removes "Hi," or "Hi" cleanly — handles both "Hi Chandresh" and "Hi, Chandresh"
            const extractedName = displayedName.replace(/^Hi,?\s*/i, '').trim();

            // Automatically insert user into DB after successful login
            // Uses INSERT IGNORE so it won't fail if user already exists
            await queryResult(
                `INSERT IGNORE INTO users (username, email, password_hash, role, created_at)
                 VALUES (?, ?, ?, ?, NOW())`,
                [
                    extractedName, // cleaned display name
                    username,       // Email from .env
                    'managed_by_himtrek',
                    'user',
                ]
            );

            console.log(` User "${username}" saved to local DB after login`);
        }
    }
}