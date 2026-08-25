#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nije pronađen. Instaliraj Node.js 22 LTS."
  exit 1
fi

if [ ! -d node_modules/@fluentui/react-components ]; then
  echo "Instaliram ili osvežavam zavisnosti..."
  npm install --no-audit --no-fund
fi

npm run build
npm run dev -- --host 127.0.0.1 --port 5600
