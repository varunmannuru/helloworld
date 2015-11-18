// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-10-07 using
// generator-karma 0.8.3

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'bower_components/modernizr/modernizr.js',
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/json3/lib/json3.js',
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/jquery.cookie/jquery.cookie.js',
            'bower_components/jquery-placeholder/jquery.placeholder.js',
            'bower_components/foundation/js/foundation.js',
            'bower_components/foundation-datepicker/js/foundation-datepicker.js',
            'bower_components/angular-foundation/mm-foundation-tpls.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-ui-utils/ui-utils.js',
            'bower_components/angular-translate/angular-translate.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/d3/d3.js',
            'bower_components/nvd3/nv.d3.js',
            'bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
            'bower_components/moment/moment.js',
            'bower_components/angular-block-ui/dist/angular-block-ui.js',
            'bower_components/lodash/lodash.js',
            'bower_components/nsPopover/src/nsPopover.js',
            'bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
            'bower_components/mapbox.js/mapbox.js',
            'bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
            'bower_components/ion.rangeSlider/js/ion.rangeSlider.js',
            'bower_components/angular-nvd3/dist/angular-nvd3.min.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/ngFitText/src/ng-FitText.js',
            'bower_components/angular-cookie/angular-cookie.js',
            // endbower

            'app/scripts/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
