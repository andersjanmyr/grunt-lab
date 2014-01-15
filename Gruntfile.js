"use strict";
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    var pkg = grunt.file.readJSON('package.json');
    var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };
    grunt.initConfig({
        pkg: pkg,

        // JsHint
        jshint: {
            // JsHint configuration is read from packages.json
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                'Gruntfile.js',
                'app/scripts/**/*.js',
                'test/**/*.js'
            ]
        },

        connect: {
            options:{
                port: 9000,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            // LIVE RELOAD DISABLED:
//                            require('connect-livereload')(),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            }
        },

        open: {
            all: {
                path: 'http://localhost:<%= connect.options.port%>'
            }
        },

        // Less
        less: {
            dev: {
                expand: true,
                cwd: 'app/styles/',
                src: 'main.less',
                ext: '.css',
                dest: 'app/styles/'
            },
            release: {
                expand: true,
                cwd: 'app/styles/',
                src: 'main.less',
                ext: '.css',
                dest: 'dist/app/styles/',
                options: {
                    compress: true
                }

            }
        },

        // Watch
        watch: {
            // watch:less invokes less:dev when less files change
            less: {
                files: ['app/styles/*.less'],
                tasks: ['less:dev']
            },
            livereload: {
                files: [
                    'app/*.html',
                    'app/styles/{,*/}*.css',
                    'app/scripts/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
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
            html: 'app/index.html',
            options: {
                dest: 'dist/app'
            }
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
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: 'app',
                        src: [
                            'images/*.{png,gif,jpg,jpeg,svg,ico}',
                            '*.html'
                        ],
                        dest: 'dist/app'
                    }
                ]
            }
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
                files: [{
                    src: [
                        'dist/app/images/*.{jpg,jpeg,gif,png,svg}',
                        'dist/app/scripts/*.js',
                        'dist/app/styles/*.css'
                    ]
                }]
            }
        },

        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
            html: ['dist/app/*.html'],
            css: ['dist/app/styles/*.css'],
            options: {
                assetsDirs: ['dist/app', 'dist/app/styles']
            }
        }

    });

    // Invoked when grunt is called
    grunt.registerTask('default', 'Default task', [
        'jshint',
        'less:dev'
    ]);

    grunt.registerTask('preview',[
        'less:dev',
        'connect:livereload',
        'open',
        'watch'
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

