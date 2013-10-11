(function (Soul){
	// Chat User
	Soul.getModel('user').spec({
		defaults: {
			name: '',
			last_ts: 0,
			shared_id: Soul.session('sharedId')
		},

		cnt: function (name, val){
			var cnt = Soul.getCollection('user-counter').get(this.id);
			if( !cnt ){
				cnt = Soul.getCollection('user-counter').create({ id: this.id });
				cnt.save();
			}
			return	name ? cnt[val === void 0 ? 'get' : 'set'](name, val) : cnt;
		}
	});

	// Users
	Soul.getCollection('user').spec({
		share: true,
		storage: 'soul'
	});

	// User counters
	Soul.getModel('user-counter').spec({
		defaults: {
			all: 0,
			unread: 0
		}
	});

	Soul.getCollection('user-counter').spec({
		storage: 'runtime'
	});

	// Chat messages
	Soul.getModel('message').spec({
		users: Soul.getCollection('user'),

		defaults: {
			type: 0,
			to_user_id: 0,
			from_user_id: 0,
			body: ''
		},

		getToUser: function (){
			return	this.users.get( this.get('to_user_id') );
		},

		getFromUser: function (){
			return	this.users.get( this.get('from_user_id') );
		}
	});

	// Общии сообщения (чат)
	Soul.getCollection('message').spec({
		share: true, // Расшарить между всеми юзерами (браузерами)
		storage: 'runtime'
	});

	// Приватные сообщения между разными юзерами
	Soul.getCollection('message.private').spec({
		share: 'private', // приватная коллекция
		storage: 'runtime',
		getSharedId: function (msg){
			return	msg.getToUser().get('shared_id');
		}
	});


	xtpl.decl('scroll2bottom', {
		init: function (el){
			this.update(el);
		},
		update: function (el){
			el.scrollTop = el.scrollHeight + 1e3;
		}
	});



	var app = Soul.new({ useHistory: true }, {
		el: '#chat',
		boundAll: ['filterPrivateMsg'],

		model: {
			newMsg:     Soul.getCollection('message').newModel(),
			privateMsg: Soul.getCollection('message.private').newModel(),

			toUser:   null,
			authUser: function (){
				return	Soul.getCollection('user').fetch().pipe(function (Users){
					var user = Users.get( Soul.session('user_id') );
					if( !user ){
						user = Users.create();
					}
					return	user;
				});
			}
		},

		collection: {
			users:    Soul.getCollection('user'),
			private:  Soul.getCollection('message.private'),
			messages: Soul.getCollection('message')
		},

		init: function (){
			// Каждые 40sec обновляем свой стасус, чтобы быть в online
			setInterval(function (){
				var user = this.model.authUser;
				if( !user.isNew() ){
					user.set({ last_ts: +new Date }).save();
					this.$apply();
				}
			}.bind(this), 40000);

			// Слушатель события добавления приватного сообщения
			this.collection.private.on('add', this, function (msg){
				var user = msg.getFromUser(), model = this.model;
				if( user.id !== model.authUser.id ){
					user.cnt()
						.inc('all')
						.inc('unread', +!(user.id == (model.toUser && model.toUser.id)))
						.save()
					;
				}
				else {
					msg.getToUser().cnt().inc('all').save();
				}
			});

			if( !this.model.authUser.isNew() ){
				// Отправить всем юзерам привествие
				this.sendWelcomeMsg();
			}
		},

		saveUser: function (){
			this.model.authUser.set({ last_ts: +new Date }).save().done(this.fn(function (user){
				Soul.session('user_id', user.id);
				this.sendWelcomeMsg();
			}));
		},

		// Добавить сообщение в общий чат
		addMessage: function (){
			var model = this.model.newMsg;

			model
				.clone()
				.set({ from_user_id: this.model.authUser.id, last_ts: +new Date })
				.save()
			;

			model.clear();
		},

		sendWelcomeMsg: function (){
			this.model.newMsg.clone().set({
				  type: 1
				, from_user_id: this.model.authUser.id
			}).save();
		},

		// Преход на страницу приватных сообщений
		'/private/:userId/': function (req){
			this.openPrivateDialog(req.params.userId);
		},

		// Открыть приватные сообщения
		openPrivateDialog: function (userId){
			var model = this.model;
			model.toUser = this.collection.users.get(userId);
			model.toUser.cnt('unread', 0); // Сбросить счетчик непрочитанных у второго юзера
		},

		// Закрыть дилог
		closePrivateDialog: function (){
			this.model.toUser = null;
			this.router.nav('/');
		},

		// Отправить приватное сообщение
		sendPrivateMsg: function (){
			var model = this.model, privateMsg = model.privateMsg;
			privateMsg.clone()
				.set({ from_user_id: model.authUser.id, to_user_id: model.toUser.id })
				.save()
			;
			privateMsg.clear();
		},

		// Фильтр: онлайн
		isOnlineUser: function (user){
			return	new Date - user.get('last_ts') < 60000;
		},

		// Фильтр: приватных сообщений
		filterPrivateMsg: function (msg){
			var fromId = msg.get('from_user_id'), toId = msg.get('to_user_id'), model = this.model;
			return	fromId == model.toUser.id && toId == model.authUser.id || toId == model.toUser.id && fromId == model.authUser.id;
		}
	});



	app.start();
	window.app = app;
})(Soul);
