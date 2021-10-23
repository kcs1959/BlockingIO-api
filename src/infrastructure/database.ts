import { Pool, PoolClient, QueryResult } from 'pg';
import { pgConfig } from '../config/config';

const pool = new Pool(pgConfig);

const connect = async (): Promise<PoolClient> => {
    return await pool.connect();
};

const release = (client: PoolClient): void => {
    client.release();
};

const performSQL = async <Data>(
    sql: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any[] | null,
    client: PoolClient
): Promise<Data[]> => {
    let result: QueryResult<Data>;
    if (values != null) {
        result = await client.query(sql, values);
    } else {
        result = await client.query(sql);
    }
    return result.rows;
};

export { connect, release, performSQL };
