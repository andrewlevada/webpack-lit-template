const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const path = require("path");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    {
        ignores: ["node_modules/**", "build/**", "webpack.**"],
    },
    ...compat.config({
        env: {
            browser: true,
            es2021: true,
        },
        extends: [
            "airbnb-base",
            "plugin:@typescript-eslint/recommended",
            "plugin:wc/recommended",
            "plugin:wc/best-practice",
            "plugin:lit/recommended",
        ],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaVersion: 12,
            sourceType: "module",
            tsconfigRootDir: __dirname,
        },
        plugins: ["@typescript-eslint", "lit", "wc"],
        settings: {
            "import/resolver": { typescript: {} },
            wc: { elementBaseClasses: ["LitElement"] },
        },
        rules: {
            quotes: ["error", "double"],
            "class-methods-use-this": [
                "error", { exceptMethods: ["render", "connectedCallback"] },
            ],
            "object-curly-newline": [
                "error", { ImportDeclaration: "never" },
            ],
            "no-return-assign": [
                "error", "except-parens",
            ],
            indent: [
                "error", 4, { FunctionDeclaration: { parameters: "first" } },
            ],
            "wc/guard-super-call": "off",
            "no-unused-vars": "off",
            "no-param-reassign": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-inferrable-types": "off",
            "import/no-duplicates": "off",
            curly: ["error", "multi"],
            "arrow-parens": ["error", "as-needed"],
            "no-extend-native": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            radix: "off",
            "nonblock-statement-body-position": "off",
            "no-use-before-define": "off",
            "lines-between-class-members": "off",
            "import/extensions": "off",
        },
    }),
];
