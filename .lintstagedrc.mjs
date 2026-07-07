export default {
  "*.{js,mjs,cjs,ts,tsx}": [
    "eslint --config ./eslint.config.mjs --fix --max-warnings=0",
    "prettier --write",
  ],
  "*.{json,md,yml,yaml}": ["prettier --write"],
  "*.py": ["ruff check --fix", "black"],
};
