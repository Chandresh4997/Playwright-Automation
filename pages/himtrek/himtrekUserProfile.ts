import { Locator, Page } from "@playwright/test"

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
        // robustly wait for and click navigation links, then the activity item
        await this.linkWishlist.waitFor({ state: 'visible', timeout: 15000 });
        await this.linkWishlist.click();

        await this.linkActivity.waitFor({ state: 'visible', timeout: 15000 });
        await this.linkActivity.click();

        // The activity image can be lazy-loaded/hidden; try visible first, otherwise force-click after scrolling
        try {
            await this.trekDayaraBugyal.waitFor({ state: 'visible', timeout: 20000 });
            await this.trekDayaraBugyal.scrollIntoViewIfNeeded();
            await this.trekDayaraBugyal.click();
        } catch (err) {
            // fallback: ensure attached, scroll and force-click
            try {
                await this.trekDayaraBugyal.waitFor({ state: 'attached', timeout: 20000 });
                await this.trekDayaraBugyal.scrollIntoViewIfNeeded();
                await this.trekDayaraBugyal.click({ force: true });
            } catch (err2) {
                // rethrow original for visibility into failure
                throw err;
            }
        }
    }
}