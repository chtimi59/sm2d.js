module.exports = function(grunt)
{
    var sources = [
        'main.js',
        'object/*.js',
        'drawing/*.js',                        
        'ui/*.js',
    ];

    console.log("js sources:");
    console.log(sources);
    console.log("");
    
    var js_src_path = [];
    sources.forEach(function(e) { js_src_path.push('src/' + e) });

    var js_conactsrc_path = [];
    sources.forEach(function(e) { js_conactsrc_path.push('.gen/src/' + e) });   
    
    grunt.loadNpmTasks('grunt-contrib-sass'); 
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify'); 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');

    // Configuration de Grunt    
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        
        // Sass (Syntactically Awesome Stylesheets)
        // est un langage de génération dynamique de feuilles de style.
        // -----------------------------------------------
        // installed from:
        //        npm install grunt-contrib-sass --save-dev
        //        gem install sass        
        sass: {
            compile: {
                options: {
                  style: 'expanded'
                },
                files: [{
                  "expand": true,
                  "cwd": "src/",
                  "src": ["*.css"],
                  "dest": "dist/",
                  "ext": ".css"
                }]
            }
        },
        
        // Replace a pattern string in JS sources
        // -----------------------------------------------
        // installed from:
        //       npm install grunt-replace --save-dev
        replace: {
            compile: {
                options: {
                 // pass, we use built-in replacements (like @@__SOURCE_FILE__ )
                },
                files: [
                  {expand: true, flatten: false, src: ['src/**/*.js'], dest: '.gen/'}
                ]
            }
        },
        
        // Concatenate all '.gen/' sources in one js file (pkg.name.js) source
        // -----------------------------------------------
        // installed from:
        //        npm install grunt-concat-sourcemap --save-dev
        concat_sourcemap: {
            options: {
                sourceRoot : '../'
            },
            compile: {
                files: {
                    'dist/<%= pkg.name %>.js': js_conactsrc_path
                }
            }
        },

        // Concatenate all 'src/' sources in one js file (pkg.name.js) + obfuscation 
        // -----------------------------------------------
        // installed from:
        //        npm install grunt-contrib-uglify --save-dev 
        uglify: {
            options: {
              compress: {
                warnings: false
              },
              mangle: true,
              preserveComments: /^!|@preserve|@license|@cc_on/i
            },
            compile: {
              src:  js_src_path,
              dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        
        // Watch sources changes
        // -----------------------------------------------
        // installed from:
        //        npm install grunt-contrib-watch --save-dev 
        watch: {
          scripts: {
            files: 'src/**/*.js',
            tasks: ['replace:compile', 'concat_sourcemap:compile']
          },   
          styles: {
            files: 'src/**/*.css',
            tasks: ['sass:compile']
          }
        },
       
       
    
    });

    // Définition des tâches Grunt
    grunt.registerTask('default', ['dev', 'watch'])
    
    grunt.registerTask('dev',          ['styles:dev', 'scripts:dev'])   
    grunt.registerTask('styles:dev',   ['sass:compile'])
    grunt.registerTask('scripts:dev',  ['replace:compile', 'concat_sourcemap:compile'])
    
    grunt.registerTask('dist',         ['styles:dist', 'scripts:dist'])
    grunt.registerTask('styles:dist',  ['sass:compile'])
    grunt.registerTask('scripts:dist', ['uglify:compile'])    
}