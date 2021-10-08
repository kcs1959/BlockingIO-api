## セットアップ

-   ローカルに Node.js&npm と Docker があることを確認
-   clone したら`npm install`を実行
-   `.env`ファイルを入手してプロジェクトのルートに置く

## 実行

-   `npm run start`or`npm run debug`で動かす
    -   DB サーバのコンテナが立ち上がる(ポートは`.env`で指定)
        -   バックグラウンドで立てるので終了は手動でする必要があるかも
    -   node か tsc で API サーバが立ち上がる
        -   debug では tsc-node-dev を使っているのでコード更新すると reload してくれる

## push 時

push 時に自動で linter がかかります。
フォーマッタのエラーが出た場合は`npm run format`を実行するか
vscode の format on save を有効にしてください。
