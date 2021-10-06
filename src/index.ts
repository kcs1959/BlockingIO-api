const helloWorld = () => 'Hello World';
console.log(helloWorld());

import express from 'express';
const app = express();

import { Pool, Client } from 'pg';
const connectionString =
    'postgresql://postgres:postgres@localhost:5431/postgres';
const pool = new Pool({
    connectionString: connectionString,
});
pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});

app.get('/company', (req, res) => {
    const client = new Client({
        connectionString: connectionString,
    });
    client.connect();
    client.query('SELECT * FROM Company', (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(500).send();
            return;
        }
        res.send(result.rows);
        client.end();
    });
});

app.listen(3000, () => {
    console.log('listening');
});
