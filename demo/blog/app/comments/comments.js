Soul.define(function (){
	return Soul.Layer.extend({
		tpl: './comments/comments.xtpl',

		model: {
			post: Soul.getModel('post').byReq({ 'id': 'objectId' }),
			comment: Soul.getCollection('comment').newModel({})
		},

		collection: function (params){
			var query = {
				include: 'user',
				where: '{"post_id":"'+params.id+'"}'
			};
			return	Soul.getCollection('comment').fetch(query, { reset: true });
		},

		onSave: function (){
			var comment = this.model.comment;

			comment
				.clone()
					.set({ post_id: this.model.post.id })
					.save()
			;

			comment.clear();

			// Scroll on top
			$('html,body').animate({ scrollTop: 0 }, 'fast');
		}
	});
});
