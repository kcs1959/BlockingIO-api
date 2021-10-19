#!/bin/bash
set -e

BASE_PATH=./src/routes/docsBase.ts
INPUT_PATH=./src/routes/docsJSON.json
OUTPUT_PATH=./src/routes/docs.ts

cp $BASE_PATH $OUTPUT_PATH

sed -i -e '1r ./src/routes/docsJSON.json' $OUTPUT_PATH
echo "Success updating document"