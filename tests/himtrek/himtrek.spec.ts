import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekSearchPage } from '../../pages/himtrek/searchResult';
import { HimTrekDetailsPage } from '../../pages/himtrek/trekDetails';
import { HimTrekAuthPage } from '../../pages/himtrek/himtrekAuth';
import { HimTrekUserProfilePage  } from '../../pages/himtrek/userProfile';
import { HimTrekCareerPage } from '../../pages/himtrek/himtrekCareers';

test('User Login', async({ page }) => {
  const trekPlace = new HimTrekHomePage(page);
  const trekAuth = new HimTrekAuthPage(page);

  await trekPlace.himtrekURL();
  await trekPlace.openLogin();
  await trekAuth.login(process.env.USERNAME!, process.env.PASSWORD!);
  await expect(trekPlace.nameLoggedin).toContainText("Hi");
})

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

test('Update User Profile and Browse Activity', async ({ page }) => {
  const userProfile = new HimTrekUserProfilePage(page);

  await userProfile.userProfileURL();
  await userProfile.enterInfoAboutYourself();
  await userProfile.browseActivity();
})

test('Browse Careers at HimTrek and View Terms and Conditions', async ({ page }) => {
  const trekPlace = new HimTrekHomePage(page);
  const trekCareer = new HimTrekCareerPage(page);

  await trekPlace.himtrekURL();
  await trekPlace.openCareers();
  await expect(trekCareer.headingCareer).toContainText('Careers At HimTrek');
  await trekCareer.linkTermsConditions.click();
  await expect(trekCareer.headingTermsConditions).toContainText('Terms and Conditions');
})