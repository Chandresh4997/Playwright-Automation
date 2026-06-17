import { closeDb } from './dbClient';

export default async function globalTeardown() {
    await closeDb(); // ✅ Cleanly close MySQL pool after all tests finish
    console.log('MySQL connection pool closed.');
}