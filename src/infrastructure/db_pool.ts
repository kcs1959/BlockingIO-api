import { Pool, PoolConfig } from 'pg';

const pgConfig: PoolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT ?? ''),
    host: 'localhost',
    ssl: { rejectUnauthorized: false },
    max: 5,
};

const pool = new Pool(pgConfig);

export default pool;
