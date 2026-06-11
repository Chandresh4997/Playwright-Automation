import { test, Locator, Page } from "@playwright/test"

export class HimTrekUserProfilePage{
    page: Page;
    linkSettings: Locator;
    linkWishlist: Locator;
    linkActivity: Locator;
    inputAboutYourself: Locator;
    trekDayaraBugyal: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.linkSettings = page.getByRole('link', {name: 'Settings'});
        this.inputAboutYourself = page.locator('textarea[name="st_bio"]');
        this.linkWishlist = page.getByRole('link', {name: 'Wishlist'});
        this.linkActivity = page.getByRole('link', {name: 'Activity'});
        this.trekDayaraBugyal = page.getByAltText('Dayara Bugyal Trek');
    }

    async userProfileURL(){
        await this.page.goto('https://himtrek.co.in/function-user-setting/');
    }

    async enterInfoAboutYourself(){
        await this.inputAboutYourself.fill('Hello, My name is Chandresh');
    }
    
    async browseActivity(){
        await this.linkWishlist.click();
        await this.linkActivity.click();
        await this.trekDayaraBugyal.click();
    }
}