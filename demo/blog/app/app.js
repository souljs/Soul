/**
 * Blog application
 */
Soul.define(['access', 'xtpl/post-body', './mock'], function (){
	var ADMIN_ID = 'D1tEI7LdMI';


	return Soul.create({ useHistory: true }, {
		el: '#main',

		init: function (){
			$('#loading').hide();
		},

		'/:userId?': {
			paramsRules: {
				userId: function (id){
					return !/login|signup|forgot|fun/.test(id);
				}
			},

			loadData: function (req){
				this.router.blogId = req.params.userId || 'main';
				this.router.isAdmin = Soul.User.current() && Soul.User.current().id == ADMIN_ID;
			},

			// Posts
			'/(offset/:offset)?': {
				id: 'index',
				ctrl: Soul.use('list')
			},

			// Post group
			'/post/': {
				'404': {
					accessPermission: false,
					accessDeniedRedirectTo: 'index'
				},

				'/new/': {
					id: 'post-new',
					ctrl: Soul.use('post.new'),
					accessPermission: 'auth',
					accessDeniedRedirectTo: 'login'
				},

				'/view/:id/': {
					id: 'post-view',
					ctrl: Soul.use('post')
				},

				'/edit/:id/': {
					id: 'post-edit',
					ctrl: Soul.use('post.edit'),
					accessPermission: 'auth',
					accessDeniedRedirectTo: 'post-view'
				}
			}
		},

		// Auth group
		'/login/':  {
			id: 'login',
			ctrl: Soul.use('auth'),
			accessPermission: '!auth',
			accessDeniedRedirectTo: 'index'
		},

		'/forgot/': {
			id: 'forgot',
			ctrl: Soul.use('auth'),
			accessPermission: '!auth',
			accessDeniedRedirectTo: 'index'
		},

		'/signup/': {
			id: 'signup',
			ctrl: Soul.use('auth'),
			accessPermission: '!auth',
			accessDeniedRedirectTo: '/'
		},

		// Fun zone
		'/fun/': {
			'/': {
				id: 'fun',
				tpl: './fun/fun.xtpl'
			}
		}
	}).on('route', function (){
		$('html,body').animate({ scrollTop: 0 }, 'fast');
	});
});
