import { Page, test, Locator, expect } from "@playwright/test";
import { HimTrekHomePage } from "./himtrekHome";

export class HimTrekAuthPage {
    page: Page;
    inputUsername: Locator;
    inputPassword: Locator;
    btnLogin: Locator;


    constructor(page: Page){
        this.page = page;
        this.inputUsername = page.getByRole('textbox', { name: 'Email or Username' });
        this.inputPassword = page.getByRole('textbox', { name: 'Password' });
        this.btnLogin = page.getByRole('button', { name: 'Log in' });
    }

    async login(username: string, password: string) {
        await this.inputUsername.fill(username);
        await this.inputPassword.fill(password);
        await this.btnLogin.click();
        await this.page.waitForSelector('.dropdown-user-dashboard', { state: 'visible', timeout: 10000 });
        await this.page.context().storageState({ path: 'data/auth.json' });
    }
}