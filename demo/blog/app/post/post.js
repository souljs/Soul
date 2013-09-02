Soul.define(function (){
	return Soul.Layer.extend({
		tpl: 'post/post.xtpl',
		model: Soul.getModel('post').byReq({ 'id': 'objectId' }),

		subviews: {
			comments: Soul.use('comments')
		}
	});
});
