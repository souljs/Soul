Soul.define(function (){
	/**
	 * @model	Comment
	 */
	Soul.getModel('comment').spec({
		url: 'https://api.parse.com/1/classes/comment',
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
			  post_id: ''
			, body: ''
		},


		getAuthor: function (attr){
			var user = this.get('user'), auth = Soul.User.current();
			return	user && (auth.id != user.objectId) ? user[attr] : auth.get(attr);
		}
	});




	/**
	 * @collection	Comment
	 */
	Soul.getCollection('comment').spec({
		comparator: function (left, right){
			return	new Date(right.get('createdAt')) - new Date(left.get('createdAt'));
		}
	});
});
