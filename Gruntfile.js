module.exports = function(grunt) {

    var jsSrc = ['src/main.js',
                 'src/boundingBox.js',
                 'src/circle.js'
                 'src/line.js'
                 'src/point.js'
                 'src/vector.js'
                 ];
                 
                 
    grunt.loadNpmTasks('grunt-contrib-sass'); 
    grunt.loadNpmTasks('grunt-contrib-concat'); 
    grunt.loadNpmTasks('grunt-contrib-uglify'); 
    grunt.loadNpmTasks('grunt-contrib-watch');
  
    // Configuration de Grunt    
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        
        //npm install grunt-contrib-sass --save-dev
        //gem install sass
        sass: {
            dist: {
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
        
        //npm install grunt-contrib-concat --save-dev
        concat: {
          options: { },
          compile: {
            src: jsSrc,
            dest: 'dist/<%= pkg.name %>.js'
          }
        },

        //npm install grunt-contrib-uglify --save-dev 
        uglify: {
            options: {
              compress: {
                warnings: false
              },
              mangle: true,
              preserveComments: /^!|@preserve|@license|@cc_on/i
            },
            compile: {
              src: jsSrc,
              dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        
        //npm install grunt-contrib-watch --save-dev 
        watch: {
          scripts: {
            files: 'src/*.js', // tous les fichiers JavaScript de n'importe quel dossier
            tasks: ['concat:compile']
          },   
          styles: {
            files: 'src/*.css', // tous les fichiers Sass de n'importe quel dossier
            tasks: ['sass:dist']
          }
        }
       
        
    });

    // Définition des tâches Grunt
    grunt.registerTask('default', ['dev', 'watch'])
    grunt.registerTask('dev', ['styles:dist', 'scripts:dev'])
    grunt.registerTask('dist', ['styles:dist', 'scripts:dist'])
    
    grunt.registerTask('scripts:dev', ['concat:compile'])
    grunt.registerTask('scripts:dist', ['uglify:compile'])
    
    grunt.registerTask('styles:dev', ['sass:dev'])
    grunt.registerTask('styles:dist', ['sass:dist'])

}