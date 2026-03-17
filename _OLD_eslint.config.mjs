import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    // plugins: { js },
    // extends: ['js/recommended'],
    //  extends: ['js/recommended'] и  использование js.configs.recommended (импортированного из @eslint/js) функционально одно и то же
    // Используем напрямую объект из @eslint/js
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Здесь можно переопределить правила
      // Оставляем 'off', если форматируете только через Prettier напрямую.
      // Ставим 'error', если хотите, чтобы ESLint ругался на пробелы/кавычки.
      'prettier/prettier': 'off',
    },
  },

  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },

  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },

  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: ['markdown/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },

  // // 3. Дополнительное отключение конфликтующих правил (на всякий случай)
  eslintConfigPrettier,
  // 5. Prettier — ВСЕГДА ПОСЛЕДНИМ
  // Это автоматически отключает конфликтующие правила JS и включает плагин.
  // 2. Рекомендуемая настройка Prettier (включает плагин и отключает конфликты)
  eslintPluginPrettierRecommended,
]);
