/**
 * Before "post" save
 */
Parse.Cloud.beforeSave("post", function (request, response){
	var user = Parse.User.current();
	var model = request.object;

	if( user ){
		if( model.isNew() ){
			model.set("user_id", user.id);
			model.set("published", 0);

			response.success();
		}
		else {
			var query = new Parse.Query("post");

			query.get(model.id, {
				success: function (originalModel){
					if( !originalModel.get('user_id') ){
						originalModel.set('user_id', user.id);
						model.set('user_id', user.id);
					}

					if( originalModel.get('user_id') == user.id ){
						response.success();
					}
					else {
						response.error('Access denied');
					}
				},
				error: function (){
					response.error("Object not found");
				}
			});
		}
	}
	else {
		response.error("User is not authenticated");
	}
});



/**
 * Before "comment" save
 */
Parse.Cloud.beforeSave("comment", function (request, response){
	var user = Parse.User.current();
	var model = request.object;

	if( user ){
		if( model.isNew() ){
			model.set("user", user);
			response.success();
		}
		else {
			var query = new Parse.Query("comment");

			query.get(model.id, {
				success: function (originalModel){
					if( originalModel.get('user').id == user.id ){
						response.success();
					}
					else {
						response.error('Access denied');
					}
				},
				error: function (){
					response.error("Object not found");
				}
			});
		}
	}
	else {
		response.error("User is not authenticated");
	}
});
