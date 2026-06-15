import { test } from '@playwright/test';
import { HimTrekUserProfilePage  } from '../../pages/himtrek/himtrekUserProfile';

test('Update User Profile and Browse Activity', async ({ page }) => {
  const userProfile = new HimTrekUserProfilePage(page);

  await userProfile.userProfileURL();
  await userProfile.enterInfoAboutYourself();
  await userProfile.browseActivity();
})