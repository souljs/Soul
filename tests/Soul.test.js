/*jslint curly: false */
/*global jQuery, Soul, module, test, expect, ok, equal, start, stop*/

(function ($){
	/**
	 *       ~~~ TESTS ~~~
	 */
	module('Soul');


	1 && test('routing', function (){
		var log = [];

		var app = Soul.create({
			el: '#LEGO',
			id: 'lego',
			model: Soul.getModel('global').eq('settings'),

			'./': {
				id: 'index',
				onRoute: function (){
					log.push('/');
				}
			},

			'/photo/': {
				'./': {
					id: 'photos',
					collection: Soul.getCollection('photo').def({ offset: 0, limit: 10 }),
					onRoute: function (){
						log.push('/photo/ ('+this.collection.length+')');
					}
				},

				'/:id(\\d+)/': {
					id: 'photo',
					model: Soul.getModel('photo'),
					onRoute: function (evt, req){
						log.push('/photo/'+req.params.id+'/ ('+this.model.get('name')+')');
					}
				},

				'/new/': {
					model: Soul.getCollection('photo').newModel({ name: 'Untitled' }),
					onRoute: function (){
						log.push('/photo/new/');

						var model = this.model;
						equal(model.get('name'), 'Untitled', 'New model "Untitled"');

						model.set({ name: 'Žižkov' }).save().done(function (){
							equal(model.id, 3, 'model.id == 3');
						});
					}
				},

				'404': {
					id: 'photo404',
					onRoute: function (){
						log.push('photo:404');
					}
				}
			},

			'404': {
				id: '404',
				onRoute: function (){
					log.push('404');
				}
			},

			onRouteStart: function (evt, req){
				log.push(this.model.get('state'));
			}
		});


		Soul.ajax.mock({
			url: '/ajax/global/settings/',
			type: 'get',
			sleep: -1,
			result: {
				status: 200,
				body: { id: 'settings', state: 'init' }
			}
		});


		Soul.ajax.mock({
			url: '/ajax/photo/',
			type: 'get',
			sleep: -1,
			result: {
				status: 200,
				body: [{ id: 123, name: 'Soul' }, { id: 124, name: 'Pilot' }, { id: 125, name: 'xtpl' }]
			}
		});


		Soul.ajax.mock({
			url: '/ajax/photo/',
			type: 'post',
			sleep: -1,
			result: {
				status: 200,
				body: { id: 3, name: 'Žižkov!' }
			}
		});



		// Start app;
		app.start('/');
		equal(log.join(' -> '), 'init -> /');

		app.nav('/xxx/');
		equal(log.join(' -> '), 'init -> / -> 404');

		app.nav('/photo/');
		equal(log.join(' -> '), 'init -> / -> 404 -> /photo/ (3)');

		app.nav('/photo/123/');
		equal(log.join(' -> '), 'init -> / -> 404 -> /photo/ (3) -> /photo/123/ (Soul)');


		app.nav('/photo/abc/');
		equal(log.join(' -> '), 'init -> / -> 404 -> /photo/ (3) -> /photo/123/ (Soul) -> photo:404');

		app.nav('/photo/new/');
		equal(log.join(' -> '), 'init -> / -> 404 -> /photo/ (3) -> /photo/123/ (Soul) -> photo:404 -> /photo/new/');

		log.splice(0, 1e5);

		app.nav('/photo/');
		app.nav('/photo/3/');
		equal(log.join(' -> '), '/photo/ (4) -> /photo/3/ (Žižkov!)');
	});


	1 && test('model + collection', function (){
		var log = [];
		var app = Soul.create({
			model: Soul.getModel('city').eq(1),
			collection: Soul.getCollection('street').byReq(),

			onRouteStart: function (){
				log.push('city');
				equal(this.model.get('name'), 'Msk');
				equal(this.collection.length, 2);
			},

			'/:streetId': {
				model: {
					city: Soul.getModel('city').eq(1),
					street: Soul.getModel('street').byReq({ streetId: 'id' })
				},
				collection: Soul.getCollection('home'),
				onRoute: function (){
					log.push('street');
					equal(this.model.street.get('name'), 'second');
					equal(this.collection.eq(0).get('name'), 'Sweet!');
				}
			}
		});


		Soul.ajax.mock({
			url: '/ajax/city/1/',
			result: {
				status: 200,
				body: { id: 1, name: 'Msk' }
			}
		});

		Soul.ajax.mock({
			url: '/ajax/street/',
			result: {
				status: 200,
				body: [{ id: 1, name: 'first' }, { id: 2, name: 'second' }]
			}
		});

		Soul.ajax.mock({
			url: '/ajax/home/',
			result: {
				status: 200,
				body: [{ id: 5, name: 'Sweet!' }]
			}
		});

		stop();
		app.nav('/').always(function (){
			equal(log.join(' -> '), 'city');

			app.nav('/2/').always(function (){
				start();
				equal(log.join(' -> '), 'city -> street', 'final');
			});
		});
	});


	1 && test('xtpl file', function (){
		expect(8);

		var app = Soul.create({
			el: '#xtpl-file',
			tpl: 'Soul.test.template.xtpl?'+Math.random(),
			model: Soul.getModel('user').create({ text: '', checked: true })
		});

		stop();
		app.nav('/').always(function (){
			var root = app.getRoot();
			var $text = app.$('[type="text"]');
			var $cbx = app.$('[type="checkbox"]');

			ok($text.length == 1, 'find input');

			app.$apply(function (){
				root.model.one('change', function (){
					equal(this.get('text'), 'RubaXa', 'mode.text.change');
				});

				$text.focus().val('RubaXa').trigger('input').blur();

				app.$apply(function (){
					var name = root.model.get('text');

					equal(name, 'RubaXa', 'model.text');
					equal(name, app.$('[type="text"]').val(), 'model.text == input.type');
					equal(app.$('.js-text').html(), 'Hello, '+name+'!', '"Hello" text');
					equal($cbx.prop('checked'), true, '$cbx == true');

					root.model.set('text', 'xtpl');
					root.model.set('checked', false);

					app.$apply(function (){
						equal($text.val(), 'xtpl', 'model.text == xtpl');
						equal($cbx.prop('checked'), false, '$cbx == false');

						start();
					});
				});
			});
		});
	});


	1 && test('xtpl-html', function (){
		stop();

		Soul.create({
			el: '#xtpl-html',
			tpl: '#xtpl-html',
			onRoute: function (){
				equal(this.$el.html(), '<ul><li>1</li><li>2</li><li>3</li></ul>');
				start();
			}
		}).start('/');
	});


	1 && test('sync model', function (){
		stop();

		window['_SoulSyncNext'] = function (iframe){
			var collection = Soul.getCollection('sync').spec({
				storage: false
			});

			collection.create({ id: 123, rnd: Math.random() }).save();

			setTimeout(function (){
				equal(collection.length, 1);
				equal(iframe.collection.length, collection.length, 'iframe');
				equal(iframe.collection.get(123).get('rnd'), collection.get(123).get('rnd'), 'model');

				iframe.collection.get(123).set('rnd', Math.random());

				setTimeout(function (){
					equal(collection.get(123).get('rnd'), iframe.collection.get(123).get('rnd'), 'model');
					start();
				}, 100);
			}, 100);
		};

		$('<iframe/>', { src: './Soul.test.iframe.html?'+Soul.uid() }).appendTo('body');
	});
})(jQuery);
