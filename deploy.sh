#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./deploy.sh \"commit message\""
  exit 1
fi

commit_message="$1"

git add .

if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

git commit -m "$commit_message"
git push origin main

echo "Pushed to origin/main. Netlify should auto-deploy."
