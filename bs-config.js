/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    "proxy": 'http://127.0.0.1/',
    //"reloadDelay": 2000,
    "injectChanges": false,
    "online": false,
    "files": [
        "dist/**/*.js"
    ],
    //"browser": "chrome"
};