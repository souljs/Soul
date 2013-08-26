Soul.define(function (){
	/**
	 * @model	Post
	 */
	Soul.getModel('post').spec({
		url: 'https://api.parse.com/1/classes/post',
		idAttr: 'objectId',
		request: {
			headers: {
				"X-Parse-REST-API-Key": "0iAtjkrIIAc1X3HuOAYPWy4CDC8wuYKIuMStdfwi",
				"X-Parse-Application-Id": "zm7HTaHs6pEy4L8T1RBqiblLFEytpmZnhL2oIL4V"
			},
			processData: false,
			contentType: 'application/json'
		},

		defaults: {
			  user_id: 0
			, published: 0
			, title: ''
			, body: ''
		}
	});




	/**
	 * @collection	Post
	 */
	Soul.getCollection('post').spec({
		comparator: function (left, right){
			return	new Date(right.get('createdAt')) - new Date(left.get('createdAt'));
		}
	});
});
