import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 1. Игнорирование служебных папок (важно для производительности)
  {
    ignores: ['dist/**', 'build/**', 'out/**', 'coverage/**'],
  },

  // 2. JavaScript настройка
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 'latest',
      sourceType: 'module', // По умолчанию для всех
    },
  },

  // Явное указание для CommonJS файлов
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
  },

  // 3. JSON / JSONC
  {
    files: ['**/*.json', '**/*.jsonc'],
    plugins: { json },
    language: 'json/json',
    ...json.configs.recommended,
  },

  // 4. Markdown
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    ...markdown.configs.recommended,
  },

  // 5. CSS
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    ...css.configs.recommended,
  },

  // 6. Prettier (Финал)
  // Включает eslint-plugin-prettier и вызывает eslint-config-prettier автоматически
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  {
    rules: {
      'prettier/prettier': 'off', // Выключаем проверку стиля внутри ESLint
    },
  },
]);
