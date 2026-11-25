const js = require('@eslint/js');
const globals = require('globals');

// Lints the custom scripts only. Run by the gulp `lint` task.
module.exports = [
    js.configs.recommended,
    {
        files: ['assets/js/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                ...globals.browser,
                bootstrap: 'readonly',
                Splide: 'readonly'
            }
        }
    }
];
