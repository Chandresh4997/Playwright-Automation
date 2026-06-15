import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekSearchPage } from '../../pages/himtrek/himtrekSearchResult';
import { HimTrekDetailsPage } from '../../pages/himtrek/himTrekDetails';

test('User Search Treks and Add a Trek to Wishlist', async ({ page }) => {
  const trekPlace = new HimTrekHomePage(page);
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
  await trekDetail.fillEnquiryForm('Chandresh Thakkar', '9574678597', 'Dayara Bugyal Trek');
})