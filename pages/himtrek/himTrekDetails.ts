import { Page, expect, Locator } from "@playwright/test";
import { queryResult } from "../../db/dbClient";

export class HimTrekDetailsPage {
    page: Page;
    btnWishlist: Locator;
    wishlistContainer: Locator;
    contactForm: Locator;
    formName: Locator;
    formPhoneNumber: Locator;
    formTrip: Locator;
    formBtnSubmit: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnWishlist      = page.locator('.stt-icon-heart1');
        this.wishlistContainer = page.locator('.service-add-wishlist');
        this.contactForm      = page.locator('[aria-label="Contact form"]');
        this.formName         = page.locator('#name');
        this.formPhoneNumber  = page.locator('#phone');
        this.formTrip         = page.locator('#trips');
        this.formBtnSubmit    = page.locator('[value="Submit"]');
    }

    async addToWishlist() {
        if ((await this.wishlistContainer.getAttribute('title')) === 'Add to wishlist') {
            await this.btnWishlist.dblclick();
        }
        await expect(this.wishlistContainer).toContainClass('added');
    }

    async fillEnquiryForm(name: string, phone: string, trip: string) {
        await this.formName.fill(name);
        await this.formPhoneNumber.fill(phone);
        await this.formTrip.fill(trip);
        await this.formBtnSubmit.click();

        // Optionally save enquiry to local DB when ENABLE_DB=true
        const enableDb = process.env.ENABLE_DB === 'true';
        if (enableDb) {
            await queryResult(
                `INSERT INTO enquiries (name, phone, trip_name, email, status, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [name, phone, trip, null, 'submitted']
            );
            console.log(`✅ Enquiry saved to DB — Trip: ${trip}, Name: ${name}`);
        }
    }
}