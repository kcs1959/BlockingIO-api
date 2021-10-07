import * as dotenv from 'dotenv';
// .envから環境変数を読み込み
dotenv.config();

const helloWorld = () => 'Hello World';
console.log(helloWorld());
