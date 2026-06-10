import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekSearchPage } from '../../pages/himtrek/searchResult';
import { HimTrekDetailsPage } from '../../pages/himtrek/trekDetails';

test('himtrek flow', async ({ page }) => {

  const trekPlace = new HimTrekHomePage(page);
  const trekSearch = new HimTrekSearchPage(page);
  const trekDetail = new HimTrekDetailsPage(page);

  await trekPlace.himtrekURL();
  await trekPlace.login(process.env.USERNAME!, process.env.PASSWORD!);
  await trekPlace.search('Uttarakhand', '14', '16');
  await expect(page.locator('#modern-result-string')).toContainText('Uttarakhand');
  await trekSearch.selectDuration();
  await trekSearch.sortByPrice();
  await trekSearch.switchToListView();
  await trekSearch.viewTrek.click();
  await page.waitForLoadState('load');
  await trekDetail.addToWishlist();
})