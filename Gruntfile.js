'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    // configurable paths
    var packageConfig = {
        src: 'src',
        libs: 'lib',
        dist: 'dist',
        name: 'polymer'
    };

    grunt.initConfig({
        pkg: packageConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
        
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= pkg.src %>/index.html',
                    '<%= pkg.src %>/designer/{,*/}*.*',
                    '<%= pkg.src %>/elements/**/*.html',
                    '{.tmp,<%= pkg.src %>}/js/{,*/}*.js',
                    '<%= pkg.src %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, packageConfig.libs),
                            mountFolder(connect, packageConfig.src)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, packageConfig.src)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, packageConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= pkg.dist %>/*'],
            elements: ['<%= pkg.src %>/elements'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= pkg.src %>/js/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
    
        useminPrepare: {
            html: '<%= pkg.src %>/index.html',
            options: {
                dest: '<%= pkg.dist %>'
            }
        },
        usemin: {
            html: ['<%= pkg.dist %>/{,*/}*.html'],
            css: ['<%= pkg.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= pkg.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.src %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= pkg.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= pkg.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= pkg.src %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/pkg/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= pkg.src %>',
                    src: '*.html',
                    dest: '<%= pkg.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= pkg.src %>',
                    dest: '<%= pkg.dist %>/<%= pkg.name %>',
                    src: [
                        'designer/{,*/}*.*',
                        'css/**',
                        'elements/**',
                        'icons/**',
                        'js/**',
                        'metadata/**'
                    ]
                }]
            },
            polymer: {
                src: '<%= pkg.libs %>/bower_components/polymer/polymer.min.js',
                dest: '<%= pkg.src %>/js/polymer.min.js'
            },
            elements: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= pkg.libs %>/bower_components',
                    dest: '<%= pkg.src %>/elements',
                    src: [ // we have to maintain their structure unless we want to muck about in their files cuz they have relative references
                        'polymer-ui-elements/polymer-ui-*/polymer-ui*.{html,css}', 
                        'polymer-elements/polymer-*/polymer-*.{html,css}'
                    ]
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= pkg.src %>/scripts/main.js'
            }
        }
    });


    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'clean:elements',
            'copy:polymer',
            'copy:elements',
            
            'connect:livereload',
            'copy',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'clean:elements',
        'copy:polymer',
        'copy:elements',
        
        
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'clean:elements',
        'copy:polymer',
        'copy:elements',
        
        //'useminPrepare',
        //'imagemin',
        //'htmlmin',
        //'concat',
        //'cssmin',
        //'uglify',
        'copy',
        //'usemin'
    ]);

    // here we're pulling in the necessary code to use the elements in the package
    grunt.registerTask('copy-elements', ['clean:elements', 'copy:polymer', 'copy:elements']);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
