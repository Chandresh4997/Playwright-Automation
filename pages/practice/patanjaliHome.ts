import {Page, Locator} from "@playwright/test"

export class PatanjaliHomePage{
    page: Page;
    closeButton: Locator;
    searchProduct: Locator;
    searchButton: Locator;
    userIcon: Locator;
    loginEmail: Locator;
    loginPassword: Locator;
    loginButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.userIcon = page.locator('.users-icon');
        this.loginEmail = page.locator('#loginemail');
        this.loginPassword = page.locator('#loginpassword');
        this.loginButton = page.locator('#login_button');
        this.closeButton = page.getByRole('button', { name: '×' });
        this.searchProduct = page.locator('#search');
        this.searchButton = page.locator('.btnn');
    }
    
    async patanjaliURL(){
        await this.page.goto("https://www.patanjaliayurved.net/");
        await this.closeButton.click();
    }
    
    async login(email: string, password: string){
        await this.userIcon.click();
        await this.loginEmail.fill(email);
        await this.loginPassword.fill(password);
        await this.page.waitForLoadState('load');
        await this.loginButton.click();
        await this.closeButton.click();
    }
    
    async searchingProduct(productName: string):Promise<void>{
        await this.searchProduct.fill(productName);
        await this.searchButton.click();
    }   
}