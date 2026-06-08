import dotenv from 'dotenv';

const envName = process.env.TEST_ENV || 'qa';

dotenv.config({
    path: `.env.${envName}`
});

export const ENV = { baseUrl: process.env.BASE_URL! };