module('Soul.defer');


test('defer.resolve', function (){
	expect(4);

	Soul.defer().resolve('ok')
		.done(function (res){ equal('ok', res); })
		.fail(function (res){ equal('fail', res); })
		.then(function (res){ equal('ok', res); }, function (res){ equal('fail', res); })
	;

	Soul.defer()
		.done(function (res){ equal('ok', res); })
		.fail(function (res){ equal('fail', res); })
		.then(function (res){ equal('ok', res); }, function (res){ equal('fail', res); })
		.resolve('ok')
	;

	Soul.defer()
		.done(function (res){ equal('ok', res); })
		.fail(function (res){ equal('fail', res); })
		.promise()
			.resolve('ok')
	;
});


test('defer.reject', function (){
	expect(4);

	Soul.defer().reject('fail')
		.done(function (res){ equal('ok', res); })
		.fail(function (res){ equal('fail', res); })
		.then(function (res){ equal('ok', res); }, function (res){ equal('fail', res); })
	;

	Soul.defer()
		.done(function (res){ equal('ok', res); })
		.fail(function (res){ equal('fail', res); })
		.then(function (res){ equal('ok', res); }, function (res){ equal('fail', res); })
		.reject('fail')
	;

	Soul.defer()
		.done(function (res){ equal('ok', res); })
		.fail(function (res){ equal('fail', res); })
		.promise()
			.reject('fail')
	;

});
