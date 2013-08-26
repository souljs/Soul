'use strict';

module.exports = function (grunt){
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			scripts: {
				files: 'src/**/*.js',
				tasks: ['build'],
				options: { interrupt: true }
			}
		},

		concat: {
			dist: {
				src: [
					  'src/Soul.js'
					, 'src/Soul.defer.js'
					, 'src/Soul.http.js'
					, 'src/Soul.Emitter.js'
					, 'src/Soul.Model.js'
					, 'src/Soul.Collection.js'
					, 'src/Soul.Storage.js'
					, 'src/Soul.Tabs.js'
					, 'src/Soul.Hub.js'
					, 'src/Soul.User.js'
				],
				dest: 'dist/Soul.client.js'
			}
		},


		uglify: {
			options: {
				banner: '/*! Soul <%= pkg.version %> - <%= pkg.license %> | <%= pkg.repository.url %> */\n'
			},
			dist: {
				files: {
					  'dist/Soul.client.min.js': ['dist/Soul.client.js']
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
//	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');


//	grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('build', ['concat']);


	// Default task.
	grunt.registerTask('default', ['build', 'uglify']);
//	grunt.registerTask('default', ['test', 'uglify']);
};
