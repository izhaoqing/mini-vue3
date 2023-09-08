module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "overrides": [
        {
            "env": {
                "node": true,
            },
            "files": [
                ".eslintrc.{js,cjs}",
            ],
            "parserOptions": {
                "sourceType": "script",
            },
        },
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "rules": {
        'indent': [2, 4, { SwitchCase: 1 }],
        // 语句末尾使用分号
        'semi': [2, 'always'],
        // 在花括号中使用一致的空格
        'object-curly-spacing': [2, 'always'],
        // 当最后一个元素或属性与闭括号 ] 或 } 在不同的行时，要求使用拖尾逗号；当在同一行时，禁止使用拖尾逗号
        'comma-dangle': [2, 'always-multiline'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-this-alias': 'off',
    },
};
