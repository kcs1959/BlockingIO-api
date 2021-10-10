import * as dotenv from 'dotenv';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import * as docs from '../docs/api';
import * as config from './config/config';

// .envから環境変数を読み込み
dotenv.config();

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs.document));
app.listen(config.PORT);
