import { Given, When, Then } from '@cucumber/cucumber';
import { HimTrekUserProfilePage } from '../../pages/himtrek/himtrekUserProfile';
import { world } from '../support/world';
import assert from 'assert';

Given('I open the user profile page', async () => {
  const page = new HimTrekUserProfilePage(world.page);
  await page.userProfileURL();
});

When('I enter info about myself', async () => {
  const page = new HimTrekUserProfilePage(world.page);
  await page.enterInfoAboutYourself();
});

Then('I can browse my activity', async () => {
  const page = new HimTrekUserProfilePage(world.page);
  await page.browseActivity();
  assert(true);
});
