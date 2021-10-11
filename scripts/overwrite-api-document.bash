#!/bin/bash
BASE_PATH=./src/routes/docs-base.ts
INPUT_PATH=./src/routes/docs.json
OUTPUT_PATH=./src/routes/docs.ts

cp $BASE_PATH $OUTPUT_PATH

sed -i "" -e '1r ./src/routes/docs.json' $OUTPUT_PATH