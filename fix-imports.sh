#!/bin/bash
# Fix type imports
find src -name "*.tsx" -o -name "*.ts" | grep -v node_modules | while read file; do
  sed -i.bak \
    -e "s|from '@types/index'|from '@types'|g" \
    -e "s|import { \(.*\) } from '@types'|import type { \1 } from '@types'|g" \
    "$file"
  rm -f "${file}.bak"
done
echo "Fixed imports"
