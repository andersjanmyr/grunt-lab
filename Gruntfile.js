"use strict";
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

        // JsHint
        jshint: {
            // jshint configuration is read from packages.json
            options: pkg.jshintConfig,
            all: [
                'Gruntfile.js',
                'app/scripts/**/*.js',
                'test/**/*.js'
            ]
        },

        // Less
        less: {
            // less:dev creates a main.css from the less files.
            dev: {
            },

            // less:release creates an optimized dist/app/styles/main.css
            // from the less files
            release: {
            }
        },

        // Watch
        watch: {
            // watch:less invokes less:dev when less files change
            less: {
            }
        },

        // Clean
        clean: {
            // clean:release removed the dist directory
            release: [ 'dist' ]
        },

        // UseminPrepare
        // Prepares for javascript concatenation by parsing the build:js
        // tags in app/index.html, options.dest is dist/app
        useminPrepare: {
        },

        // Concat
        concat: {
            options: {
                separator: ';'
            },
            // dist configuration is provided by useminPrepare
            dist: {}
        },

        // Uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            // dist configuration is provided by useminPrepare
            dist: {}
        },

        // Copy HTML, images and fonts
        copy: {
            // copy:release copies all html and image files to dist
            // preserving the structure
            release: {
            },
        },

        // Filerev
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                // filerev:release hashes(md5) all assets (images, js and css )
                // in dist directory
            }
        },

        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
        }

    });

    // Invoked when grunt is called
    grunt.registerTask('default', 'Default task', [
        'jshint',
        'less:dev'
    ]);

    // Invoked with grunt release, creates a release structure
    grunt.registerTask('release', 'Creates a release in /dist', [
        'clean',
        'jshint',
        'less:release',
        'useminPrepare',
        'concat',
        'uglify',
        'copy',
        'filerev',
        'usemin'
    ]);

};

