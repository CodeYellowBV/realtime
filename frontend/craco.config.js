module.exports = {
    // Babel config
    babel: {
        plugins: [
            // Allow imports to be done from src. import 'component/...' instead of '../../component/...'
            [
                'module-resolver',
                {
                    root: ['./src'],
                },
            ],
            // Allow decorators
            [
                '@babel/plugin-proposal-decorators',
                {
                    // use decorators in legacy mode
                    legacy: true,
                },
            ],
        ],
    },
    // Eslint config
    eslint: {
        enable: true,
        configure: {
            // Use babel to parse unknown symbols. This is used for decorators
            parser: 'babel-eslint',
            parserOptions: {
                ecmaFeatures: {
                    legacyDecorators: true,
                },
                babelOptions: {
                    configFile: './babel.config.js',
                },
            },
            globals: {
                // Make t a known global. T is used for i18n
                t: 'writable',
                window: 'writable',
            },
        },
    },
};
