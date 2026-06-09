import test, { expect } from "@playwright/test";
import { PatanjaliHomePage } from "../../pages/practice/patanjaliHome";

test('Validate ghee product', async({page}) => {
    const productHome = new PatanjaliHomePage(page)

    await productHome.patanjaliURL();
    await productHome.login('chandreshthakkar9090@gmail.com', 'Chandresh@1105');
    await productHome.searchingProduct('ghee');
    await expect(page.getByRole('heading', {name: 'You searched for - "ghee"'})).toBeVisible();
})