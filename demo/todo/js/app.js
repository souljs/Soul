(function( window ) {
	'use strict';

	// Define model
	Soul.getModel('todo').spec({
		defaults: {
			title: '',
			completed: false
		}
	});


	// Define collection
	Soul.getCollection('todo').spec({
		storage: 'local' // use localSotrage
	});


	var app = Soul.create({ useHistory: true }, {
		el: '#todos',
		filter: 'all', // default
		boundAll: ['todoFilter'],

		model: {
			  stats: { all: 0, active: 0, completed: 0 }
			, newTodo: Soul.getCollection('todo').newModel()
			, editTodo: null
			, filters: {
				All: '/',
				Active: '/active',
				Completed: '/completed'
			}
		},

		collection: Soul.getCollection('todo'),

		init: function (){
			this.collection.on('change', this, this.onChangeCollection = function (){
				var stats = this.model.stats, collection = this.collection;

				stats.all = collection.length;
				stats.active = stats.completed = 0;

				collection.each(function (model){
					var completed = model.get('completed');
					stats[completed ? 'completed' : 'active']++;
					model.save();
				});
			});

			this.onChangeCollection();
		},

		'./:filter?': function (req/**Pilot.Request*/){
			this.filter = req.params.filter || 'all';
		},

		todoFilter: function (todo/**Soul.Model*/){
			var completed = todo.get('completed'), filter = this.filter;
			return	(filter == 'all') || (filter == 'active' && !completed) || (filter == 'completed' && completed);
		},

		editTodo: function (todo/**Soul.Model*/){
			this.model.editTodo = todo;
		},

		saveTodo: function (todo/**Soul.Model*/){
			if( this.model.editTodo === todo ){
				todo.save();
				this.model.editTodo = null;
			} else {
				todo.clone().save();
				todo.clear();
			}
		},

		removeTodo: function (todo/**Soul.Model*/){
			todo.remove();
		},

		markAll: function (completed/**Boolean*/){
			this.collection.each(function (model/**Soul.Model*/){
				model.set('completed', completed);
			});
		},

		clearCompleted: function (){
			this.collection.each(function (todo/**Soul.Model*/){
				if( todo.get('completed') ){
					todo.remove();
				}
			});
		}
	});

	// Run app
	app.run();
})( window );
