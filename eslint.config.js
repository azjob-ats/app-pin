// eslint.config.js
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const angularEslint = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const unusedImports = require('eslint-plugin-unused-imports');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  // Ignorar arquivos de teste
  {
    ignores: ['**/*.spec.ts'],
  },
  // =============================================
  // Configuration for TypeScript files (*.ts)
  // =============================================
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json', // Path to your tsconfig
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angularEslint,
      'unused-imports': unusedImports,
      'import': importPlugin,
      'prettier': prettier,
    },
    rules: {
      // ======================
      // Code Style Rules
      // ======================
      'semi': ['error', 'always'], // Enforce semicolons at end of statements
      'quotes': ['error', 'single', { avoidEscape: true }], // Single quotes except when escaping
      'no-trailing-spaces': 'error', // Disallow trailing whitespace
      'eol-last': ['error', 'always'], // Require newline at end of files
      'object-curly-spacing': ['error', 'always'], // Consistent spacing inside braces: { foo: bar }

      // ======================
      // Code Quality Rules
      // ======================
      'no-console': ['error', { allow: ['warn', 'error'] }], // Only allow console.warn/error
      'no-debugger': 'error', // Disallow debugger statements
      'no-var': 'error', // Require let/const instead of var
      'prefer-const': 'error', // Suggest const when variables aren't reassigned
      'require-await': 'error', // Disallow async functions without await

      // ======================
      // TypeScript Rules
      // ======================
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
        },
      ], // Error on unused variables
      '@typescript-eslint/explicit-member-accessibility': [
        'error', 
        { accessibility: 'explicit' }
      ], // Require public/private modifiers
      '@typescript-eslint/explicit-function-return-type': ['warn'], // Warn when return types are missing
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage use of 'any' type

      // ======================
      // Import Rules
      // ======================
      'unused-imports/no-unused-imports': 'error', // Error on unused imports
      'import/no-cycle': ['error', { maxDepth: 1 }], // Prevent circular dependencies

      // ======================
      // Angular-Specific Rules
      // ======================
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' }
      ], // Enforce component selector naming
      '@angular-eslint/component-class-suffix': [
        'error', 
        { suffixes: ['Component', 'Page', 'Layout'] }
      ], // Require specific class suffixes

      // ======================
      // Prettier Integration
      // ======================
      'prettier/prettier': ['error'] // Enforce Prettier formatting rules
    }
  }
];