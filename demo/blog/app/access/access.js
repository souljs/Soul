Soul.define(function (){
	Soul.access.extend({
		'auth': function (){
			return	Soul.User.isAuth();
		},

		'!auth': function (){
			return	!Soul.User.isAuth();
		}
	});
});
