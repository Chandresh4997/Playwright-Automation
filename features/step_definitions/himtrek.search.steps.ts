import { Given, When, Then } from '@cucumber/cucumber';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekSearchPage } from '../../pages/himtrek/himtrekSearchResult';
import { HimTrekDetailsPage } from '../../pages/himtrek/himTrekDetails';
import { world } from '../support/world';

When('I search for {string} with checkin {string} and checkout {string}', async (location, checkin, checkout) => {
  const home = new HimTrekHomePage(world.page);
  await home.search(location, checkin, checkout);
});

When('I apply search filters and open a trek', async () => {
  const search = new HimTrekSearchPage(world.page);
  await search.selectDuration();
  await search.sortByPrice();
  await search.switchToListView();
  await search.viewTrek.click();
  await world.page.waitForLoadState('load');
});

When('I add the trek to wishlist', async () => {
  const detail = new HimTrekDetailsPage(world.page);
  await detail.addToWishlist();
});

When('I submit an enquiry using {string} as email', async (_emailToken) => {
  const detail = new HimTrekDetailsPage(world.page);
  await detail.fillEnquiryForm('Chandresh Thakkar','9574678597','Dayara Bugyal Trek');
});