import { Page, Locator } from "@playwright/test";

export class HimTrekHomePage {

    page: Page;
    logo: Locator;
    navHome: Locator;   
    navTreks: Locator;
    navHimtrekStays: Locator;
    navRoadTrips: Locator;
    navMore: Locator;
    linkLogin: Locator;
    nameLoggedin: Locator;
    linkLogout: Locator;
    userProfile: Locator;
    inputLocation: Locator;
    inputCalendar: Locator;
    btnSearch: Locator;
    btnGoToTop: Locator;
    dateCheckIn!: Locator;
    dateCheckOut!: Locator;
    btnCalendarNext: Locator;
    linkCareer: Locator;


    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator('.custom-logo');
        this.navHome = page.locator('#menu-item-14482');
        this.navTreks = page.locator('#menu-item-14485');
        this.navHimtrekStays = page.locator('#menu-item-20414');
        this.navRoadTrips = page.locator('#menu-item-14484');
        this.navMore = page.locator('#menu-item-18127')
        this.linkLogin = page.getByRole('link', { name: 'Login' });
        this.nameLoggedin = page.locator('.dropdown-user-dashboard');
        this.linkLogout = page.getByRole('link', { name: 'Log out' });
        this.userProfile = page.locator('#dropdown-dashboard');
        this.inputLocation = page.locator('#location_name_activity');
        this.inputCalendar = page.locator('.form-date-field');
        this.btnCalendarNext = page.locator('.next.available').nth(1);
        this.btnSearch = page.getByRole('button', { name: 'Search' });
        this.btnGoToTop = page.locator('#gotop');
        this.linkCareer = page.getByRole('link', {name: "Careers"});
    }


    async himtrekURL() {
        await this.page.goto("https://himtrek.co.in/");
    }

    async openLogin() {
        await this.linkLogin.click();
    }

    async logout() {
        await this.logo.click();
        await this.userProfile.click();
        await this.linkLogout.click();
    }

    async search(location: string, checkIn: string, checkOut: string) {
        this.dateCheckIn = this.page.locator('div.date').filter({ hasText: checkIn }).nth(1);
        this.dateCheckOut = this.page.locator('div.date').filter({ hasText: checkOut }).nth(1);

        await this.inputLocation.fill(location);
        await this.inputCalendar.click();
        await this.btnCalendarNext.click();
        await this.dateCheckIn.click();
        await this.dateCheckOut.click();
        await this.btnSearch.click();
    }

    async openCareers(){
        await this.linkCareer.click();
    }
}