import * as dotenv from 'dotenv';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import * as docs from './routes/docs';
import * as config from './config/config';

// .envから環境変数を読み込み
dotenv.config();

const app = express();

const documentText = docs.document;
const documentJson = JSON.parse(documentText);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(documentJson));
app.listen(config.PORT);
