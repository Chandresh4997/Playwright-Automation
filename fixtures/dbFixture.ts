import { test as base, BrowserContext } from '@playwright/test';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { queryRows, queryResult } from '../db/dbClient';
import { HimTrekHomePage } from '../pages/himtrek/himtrekHome';
import { HimTrekAuthPage } from '../pages/himtrek/himtrekAuth';

// ✅ Typed DB helper exposed to every test
type DbHelper = {
    select: <T extends RowDataPacket[]>(sql: string, params?: any[]) => Promise<T>;
    execute: (sql: string, params?: any[]) => Promise<ResultSetHeader>;
};

type MyFixtures = {
    db: DbHelper;
    trekHome: HimTrekHomePage;
    trekAuth: HimTrekAuthPage;
    authenticatedContext: BrowserContext;
};

export const test = base.extend<MyFixtures>({

    // ✅ db fixture — clean typed API, no raw connection needed
    db: async ({}, use) => {
        const db: DbHelper = {
            select: (sql, params) => queryRows(sql, params),
            execute: (sql, params) => queryResult(sql, params),
        };
        await use(db);
    },

    authenticatedContext: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'data/auth.json',
        });
        await use(context);
        await context.close();
    },

    trekHome: async ({ authenticatedContext }, use) => {
        const page = await authenticatedContext.newPage();
        const homePage = new HimTrekHomePage(page);
        await use(homePage);
        await page.close();
    },

    trekAuth: async ({ authenticatedContext }, use) => {
        const page = await authenticatedContext.newPage();
        const authPage = new HimTrekAuthPage(page);
        await use(authPage);
        await page.close();
    },
});

export { expect } from '@playwright/test';