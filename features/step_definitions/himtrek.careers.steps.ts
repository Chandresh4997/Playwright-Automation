import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekCareerPage } from '../../pages/himtrek/himtrekCareers';
import { world } from '../support/world';

When('I open the careers page', async () => {
  const home = new HimTrekHomePage(world.page);
  await home.openCareers();
});

Then('I should see the Careers heading', async () => {
  const career = new HimTrekCareerPage(world.page);
  const heading = await career.headingCareer.innerText();
  expect(heading.includes('Careers At HimTrek'));
});

When('I open the terms and conditions', async () => {
  const career = new HimTrekCareerPage(world.page);
  await career.linkTermsConditions.click();
});

Then('I should see the Terms and Conditions heading', async () => {
  const career = new HimTrekCareerPage(world.page);
  const heading = await career.headingTermsConditions.innerText();
  expect(heading.includes('Terms and Conditions'));
});