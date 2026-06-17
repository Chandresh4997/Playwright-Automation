import { Before, After, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import fs from 'fs';
import { closeDb } from '../../db/dbClient';
import dotenv from 'dotenv';

const playwright = require('playwright');


dotenv.config();
setDefaultTimeout(60 * 1000);

const storagePath = 'data/auth.json';

export const world: { browser?: any; context?: any; page?: any } = {};

Before(async () => {
  world.browser = await playwright.chromium.launch({ headless: true });
  const contextOptions: any = {};
  if (fs.existsSync(storagePath)) {
    try {
      const stat = fs.statSync(storagePath);
      if (stat.size > 10) {
        contextOptions.storageState = storagePath;
      }
    } catch (e) {
      // ignore
    }
  }
  world.context = await world.browser.newContext(contextOptions);
  world.page = await world.context.newPage();
  // increase Playwright timeouts for this page to reduce flakiness
  try {
    await world.page.setDefaultTimeout(60000);
    await world.page.setDefaultNavigationTimeout(60000);
  } catch (e) {
    // ignore if not supported
  }
});

After(async () => {
  try {
    if (world.page) {
      // always attempt to save a screenshot for debugging
      const reportsDir = 'reports/screenshots';
      try { await fs.promises.mkdir(reportsDir, { recursive: true }); } catch (e) {}
      const file = `${reportsDir}/screenshot-${Date.now()}.png`;
      try { await world.page.screenshot({ path: file, fullPage: true }); } catch (e) {}
    }
  } finally {
    await world.page?.close();
    await world.context?.close();
    await world.browser?.close();
  }
});

// Close DB pool on process exit instead of after every scenario so the pool
// remains available across scenarios in the same run.
// Close DB pool once all Cucumber scenarios have finished so Node can exit cleanly.
AfterAll(async () => {
  try {
    await closeDb();
  } catch (e) {
    // ignore
  }
});