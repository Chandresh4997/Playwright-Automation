import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const pool: Pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function getDbClient(): Promise<PoolConnection> {
    return await pool.getConnection();
}

// For SELECT — returns typed rows
export async function queryRows<T extends RowDataPacket[]>(
    sql: string,
    params?: any[]
): Promise<T> {
    const [rows] = await pool.execute<T>(sql, params);
    return rows;
}

// For INSERT / UPDATE / DELETE — returns result metadata
export async function queryResult(
    sql: string,
    params?: any[]
): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
}

export async function closeDb() {
    await pool.end();
}