module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2020: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'linebreak-style': 0,
        'no-console': 0,
        indent: [1, 4],
        'import/no-extraneous-dependencies': 0,
        'no-undef': 0,
        'no-underscore-dangle': 0,
        'max-len': 0,
    },
};
