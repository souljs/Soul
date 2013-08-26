/**
 * "Login", "Forgot" and "Sign up".
 */
Soul.define(function (){
	return Soul.Layer.extend({
		tpl: './auth/auth.xtpl',
		singleton: true,

		tabs: {
			"/login/": "Login",
			"/signup/": "Sign up"
		},

		model: {
			  name: ""
			, email: ""
			, password: ""
			, photo_url: ""

			, error: false
			, disabled: false
		},

		xtoggleView: function (vis){
			if( !vis ){
				this.$el.css({ position: 'absolute' });
			}

			this.$el.animate({ marginTop: !vis * 50, opacity: +vis }, 'fast', function (){
				if( vis ){
					$(this).css({ position: '' });
				}
			});
		},

		/**
		 * Submit form
		 * @param  {String}  type  Enum(login, forgot, signup)
		 */
		onSubmit: function (type){
			var model = this.model, promise;

			// Lock model
			model.disabled = true;

			if( type === 'login' ){
				promise = Soul.User.logIn(model.email, model.password);
				promise.done(this.fn(function (){
					this.router.nav('/');
				}));
			}
			else if( type === 'forgot' ){
				promise = Soul.User.requestPasswordReset(model.email);
			}
			else if( type === 'signup' ){
				var data = { name: model.name, photo_url: model.photo_url };
				promise = Soul.User.signUp(model.email, model.password, data).done(this.fn(function (){
					this.router.nav('/');
				}));
			}

			promise
				.always(this.fn(function (){
					// Unlock model
					model.disabled = false;
				}))
				.fail(this.fn(function (error){
					// Show error
					model.error = true;
				}))
			;
		}
	});
});
