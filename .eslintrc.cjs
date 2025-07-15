module.exports = {
  // Основные настройки среды
  env: {
    browser: true,    // Доступ к переменным браузера (window, document)
    es2021: true,     // Поддержка ES2021
    node: true,       // Разрешает использование require/module (если нужно)
    jest: true        // Поддержка Jest (если будете тестировать)
  },

  // Расширенные конфиги (правила от сообщества)
  extends: [
    "eslint:recommended",               // Стандартные правила ESLint
    "plugin:react/recommended",         // Правила для React
    "plugin:react-hooks/recommended",   // Правила для хуков React
    "plugin:@typescript-eslint/recommended", // Правила для TypeScript
    "plugin:prettier/recommended"       // Интеграция с Prettier (ДОЛЖЕН БЫТЬ ПОСЛЕДНИМ)
  ],

  // Парсер для TypeScript
  parser: "@typescript-eslint/parser",

  // Дополнительные параметры парсера
  parserOptions: {
    ecmaFeatures: {
      jsx: true       // Поддержка JSX
    },
    ecmaVersion: "latest",  // Современный JavaScript
    sourceType: "module"    // Используем ES-модули (import/export)
  },

  // Плагины
  plugins: [
    "react",               // Для React
    "@typescript-eslint",  // Для TypeScript
    "import"              // Для проверки импортов
  ],

  // Кастомные правила
  rules: {
    // React
    "react/react-in-jsx-scope": "off",  // Не требует импорта React в новых версиях
    "react/prop-types": "off",          // Отключаем, т.к. используем TypeScript

    // TypeScript
    "@typescript-eslint/no-explicit-any": "warn",  // Предупреждение при использовании any
    "@typescript-eslint/no-unused-vars": "warn",   // Предупреждение о неиспользуемых переменных

    // Импорты
    "import/order": [  // Сортировка импортов
      "warn",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }
    ],

    // Общие правила
    "no-console": "warn",               // Предупреждение при console.log
    "prefer-const": "error",            // Требует использовать const где возможно
    "arrow-body-style": ["error", "as-needed"]  // Упрощенные стрелочные функции
  },

  // Настройки для конкретных файлов
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      env: {
        jest: true  // Для тестовых файлов включаем Jest-окружение
      }
    }
  ],

  // Настройки для React (версия React)
  settings: {
    react: {
      version: "detect"  // Автоматически определяет версию React
    }
  }
};