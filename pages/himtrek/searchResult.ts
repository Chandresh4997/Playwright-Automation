import { Page, Locator, expect } from "@playwright/test"

export class HimTrekSearchPage {
    page: Page;
    btnDurations: Locator;
    checkbox2nights: Locator;
    checkbox3nights: Locator;
    btnSort: Locator;
    sortLowToHigh: Locator;
    listView: Locator;
    viewTrek: Locator;


    constructor(page: Page) {
        this.page = page;
        this.btnDurations = page.getByRole('button', { name: 'Durations' });
        this.checkbox2nights = page.getByLabel('2 Nights 3 Days');
        this.checkbox3nights = page.getByLabel('3 Nights 4 Days');
        this.btnSort = page.locator('#dropdownMenuSort');
        this.sortLowToHigh = page.getByLabel('Low to High');
        this.listView = page.locator('.stt-icon-list');
        this.viewTrek = page.getByAltText('Dayara Bugyal Trek');
    }

    async selectDuration() {
        await this.btnDurations.click();
        await this.checkbox2nights.check();
        await this.checkbox3nights.check();
        await this.btnDurations.click();
    }

    async sortByPrice() {
        await this.btnSort.click();
        await this.sortLowToHigh.check();
    }

    async switchToListView() {
        await this.listView.click();
    }

    async browseTrek() {
        await this.viewTrek.click();
    }
}