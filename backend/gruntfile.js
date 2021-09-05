module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'index.js',
        options: {
          args: ['dev'],
          nodeArgs: ['--debug'],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function () {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          },
          env: {
            PORT: '8181'
          },
          cwd: __dirname,
          ignore: ['node_modules/**'],
          ext: 'js,coffee',
          watch: ['server'],
          delay: 1000,
          legacyWatch: true
        }
      },
      exec: {
        options: {
          exec: 'less'
        }
      }
    },
    ts: {
      app: {
        files: [{
          src: ["app/\*\*/\*.ts", "!app/.baseDir.ts", "!app/_all.d.ts"],
          dest: "./dist"
        }],
        options: {
          module: "commonjs",
          noLib: true,
          target: "es6",
          sourceMap: false
        }
      }
    },
    tslint: {
      options: {
        configuration: "tslint.json"
      },
      files: {
        src: ["app/\*\*/\*.ts"]
      }
    },

    copy: {
      main: {
        files: [
          // includes files within path 
          { expand: true, cwd: './app/src/views/', src: ['**'], dest: './dist/src/views' },
          // { expand: true, cwd: './app/src/templates/', src: ['**'], dest: './dist/src/templates' }

        ],
      },
    },
    watch: {
      ts: {
        files: ["js/app/\*\*/\*.ts", "app/\*\*/\*.ts", "app/\*\*/\*.ejs"],
        tasks: ["ts", "tslint", "copy"]
      },
      // mycopy: {
      //   tasks: ["copy"]
      // }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask("default", [
    "ts",
    "tslint",
    "copy"
  ]);

};