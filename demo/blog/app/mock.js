Soul.define(function (){
	return;


	var posts = [{
		objectId: "C5d3GSDjd",
		title: 'Привет, Бой!',
		body: 'Это мок пост.\nРаботай, не унывай!\n' +
			'\n```js\nvar foo = "bar"```\n'+
			'http://xtpl.ru/'
	}];


	// Post: collection
	Soul.ajax.mock({
		url: 'https://api.parse.com/1/classes/post',
		type: 'get',
		result: {
			status: 200,
			body: { results: posts }
		}
	});


	Soul.each(posts, function (post){
		Soul.ajax.mock({
			url: 'https://api.parse.com/1/classes/post/'+post.objectId+'/',
			type: 'get',
			result: {
				status: 200,
				body: post
			}
		});


		Soul.ajax.mock({
			url: 'https://api.parse.com/1/classes/post/'+post.objectId,
			type: 'put',
			result: {
				status: 200,
				body: {}
			}
		});
	});
});
