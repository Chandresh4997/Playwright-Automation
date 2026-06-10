import { Page, expect, Locator } from "@playwright/test"

export class HimTrekDetailsPage {
    page: Page;
    btnWishlist: Locator;
    wishlistContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnWishlist = page.locator('.stt-icon-heart1');
        this.wishlistContainer = page.locator('.service-add-wishlist');
    }

    async addToWishlist() {
        if ((await this.wishlistContainer.getAttribute('title')) === 'Add to wishlist') {
            await this.btnWishlist.dblclick();
        }
        await expect(this.wishlistContainer).toContainClass('added');
    }
}