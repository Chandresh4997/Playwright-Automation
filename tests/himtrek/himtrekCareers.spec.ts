import { test, expect } from '@playwright/test';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekCareerPage } from '../../pages/himtrek/himtrekCareers';

test('Browse Careers at HimTrek and View Terms and Conditions', async ({ page }) => {
  const trekPlace = new HimTrekHomePage(page);
  const trekCareer = new HimTrekCareerPage(page);

  await trekPlace.himtrekURL();
  await trekPlace.openCareers();
  await expect(trekCareer.headingCareer).toContainText('Careers At HimTrek');
  await trekCareer.linkTermsConditions.click();
  await expect(trekCareer.headingTermsConditions).toContainText('Terms and Conditions');
})