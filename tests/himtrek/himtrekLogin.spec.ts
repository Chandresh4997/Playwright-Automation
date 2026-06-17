import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekAuthPage } from '../../pages/himtrek/himtrekAuth';

test('User Login @himtrek', async({ page }) => {
  const trekPlace = new HimTrekHomePage(page);
  const trekAuth = new HimTrekAuthPage(page);

  await trekPlace.himtrekURL();
  await trekPlace.openLogin();
  await trekAuth.login(process.env.USERNAME!, process.env.PASSWORD!);
  await expect(trekPlace.nameLoggedin).toContainText("Hi");
})