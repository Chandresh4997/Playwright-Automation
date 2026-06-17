import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekSearchPage } from '../../pages/himtrek/himtrekSearchResult';
import { HimTrekDetailsPage } from '../../pages/himtrek/himTrekDetails';
import { queryRows } from '../../db/dbClient';
import { RowDataPacket } from 'mysql2/promise';

interface EnquiryRow extends RowDataPacket {
    id: number;
    name: string;
    phone: string;
    trip_name: string;
    email: string;
    status: string;
    created_at: Date;
}

test('User Search Treks and Add a Trek to Wishlist @himtrek', async ({ page }) => {
    const trekPlace  = new HimTrekHomePage(page);
    const trekSearch = new HimTrekSearchPage(page);
    const trekDetail = new HimTrekDetailsPage(page);

    await trekPlace.himtrekURL();
    await trekPlace.search('Uttarakhand', '14', '16');
    await expect(page.locator('#modern-result-string')).toContainText('Uttarakhand');
    await trekSearch.selectDuration();
    await trekSearch.sortByPrice();
    await trekSearch.switchToListView();
    await trekSearch.viewTrek.click();
    await page.waitForLoadState('load');
    await trekDetail.addToWishlist();

    // ✅ Submits form on UI + saves to DB automatically
    await trekDetail.fillEnquiryForm(
        'Chandresh Thakkar',
        '9574678597',
        'Dayara Bugyal Trek',
        'chandreshthakkar@gmail.com'   // ✅ Pass email from .env
    );

    // ✅ Verify enquiry was saved in DB
    const rows = await queryRows<EnquiryRow[]>(
        `SELECT * FROM enquiries WHERE phone = ? AND trip_name = ?`,
        ['9574678597', 'Dayara Bugyal Trek']
    );

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].status).toBe('submitted');
    expect(rows[0].name).toBe('Chandresh Thakkar');
    console.log('✅ Enquiry verified in DB:', rows[0]);
});