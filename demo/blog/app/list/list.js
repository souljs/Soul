Soul.define(function (){
	/** @const */
	var LIMIT = 10;


	return Soul.Layer.extend({
		LIMIT: LIMIT,

		tpl: './list/list.xtpl',

		collection: {
			// All posts
			all: function (params){
				var query = { order: '-createdAt' };

				if( this.router.blogId == 'main' ){
					query.where = '{"published":1}';
				}
				else if( this.router.blogId != 'all' ){
					query.where = '{"user_id":"'+this.router.blogId+'"}';
				}

				return Soul.getCollection('post').fetch(query, { reset: true });
			},

			// List of posts per page
			onPage: []
		},

		onRoute: function (evt, req){
			var offset = req.params.offset|0;
			this.collection.onPage = this.collection.all.models.slice(offset, offset + LIMIT);
		},

		getPages: function (){
			var pages = [], i = this.getTotalPages();
			while( i-- ){
				pages[i] = i;
			}
			return	pages;
		},

		getCurrentPage: function (){
			var offset = this.request.params.offset|0;
			return	Math.ceil(offset/LIMIT);
		},

		getTotalPages: function (){
			return	Math.ceil(this.collection.all.length / LIMIT);
		},

		publishPost: function (post){
			post.set('published', 1).save();
		},

		unpublishPost: function (post){
			post.set('published', 0).save();
		}
	});
});
