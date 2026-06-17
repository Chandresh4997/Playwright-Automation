import { test, expect } from '../../fixtures/dbFixture';
import { RowDataPacket } from 'mysql2/promise';

interface UserRow extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: Date;
}

interface EnquiryRow extends RowDataPacket {
    id: number;
    name: string;
    phone: string;
    trip_name: string;
    email: string;
    status: string;
    created_at: Date;
}

interface LogRow extends RowDataPacket {
    id: number;
    message: string;
    created_at: Date;
}

test.describe('Dashboard - DB Verification Tests @himtrek', () => {

    // Test 1 — Verify user inserted by login spec exists in DB
    test('Verify logged-in user exists in DB @himtrek', async ({ trekHome, db }) => {
        await trekHome.himtrekURL();

        const displayedName = await trekHome.nameLoggedin.innerText();

        const rows = await db.select<UserRow[]>(
            `SELECT * FROM users WHERE email = ?`,
            [process.env.USERNAME]
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(displayedName).toContain('Hi');
        console.log('✅ User in DB:', rows[0]);
    });

    // Test 2 — Verify enquiry inserted by search/wishlist spec exists in DB
    test('Verify enquiry submitted by search test exists in DB @himtrek', async ({ db }) => {
        const rows = await db.select<EnquiryRow[]>(
            `SELECT * FROM enquiries WHERE phone = ? AND trip_name = ?`,
            ['9574678597', 'Dayara Bugyal Trek']
        );

        expect(rows.length).toBeGreaterThan(0);
        expect(rows[0].name).toBe('Chandresh Thakkar');
        expect(rows[0].status).toBe('submitted');
        console.log('✅ Enquiry in DB:', rows[0]);
    });

    // Test 3 — Verify all enquiries in DB
    test('Verify all enquiries exist in DB @himtrek', async ({ db }) => {
        const rows = await db.select<EnquiryRow[]>(
            `SELECT * FROM enquiries ORDER BY created_at DESC`
        );

        expect(rows.length).toBeGreaterThan(0);
        console.log(`✅ Total enquiries in DB: ${rows.length}`);
        rows.forEach(row =>
            console.log(`  [${row.id}] ${row.name} — ${row.trip_name} — ${row.status}`)
        );
    });

    // Test 4 — Direct DB read/write sanity check
    test('Seed and verify test log in DB @himtrek', async ({ db }) => {

        // Insert if not exists, UPDATE timestamp if already exists
        await db.execute(
            `INSERT INTO test_logs (message, created_at)
         VALUES (?, NOW())
         ON DUPLICATE KEY UPDATE created_at = NOW()`,
            ['Playwright DB test ran']
        );

        const rows = await db.select<LogRow[]>(
            `SELECT * FROM test_logs WHERE message = ?`,
            ['Playwright DB test ran']
        );

        expect(rows.length).toBeGreaterThan(0);
        console.log('Test log in DB:', rows[0]);
    });
});
