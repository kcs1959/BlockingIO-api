import { PoolConfig } from 'pg';
import * as dotenv from 'dotenv';

// .envから環境変数を読み込み
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 3000;

export const pgConfig: PoolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT ?? ''),
    host: 'localhost',
    ssl: false,
    max: 5,
};
