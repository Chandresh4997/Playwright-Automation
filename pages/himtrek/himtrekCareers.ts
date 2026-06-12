import { Page, Locator } from "@playwright/test"

export class HimTrekCareerPage{
    page: Page;
    headingCareer: Locator;
    linkTermsConditions: Locator;
    headingTermsConditions: Locator;

    constructor(page:Page){
        this.page = page;
        this.headingCareer = page.getByRole('heading', {name: 'Careers At HimTrek'});
        this.linkTermsConditions = page.getByRole('link', {name: 'Terms and Conditions'});
        this.headingTermsConditions = page.getByRole('heading', { name: 'Terms and Conditions' }).getByRole('strong');
    }
}