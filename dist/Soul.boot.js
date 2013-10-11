(function (){
	function include(src){
		document.write('<script src="'+ src +'.js?'+Math.random()+'"><' + '/script>');
	}


	function forEach(array, fn){
		var i = 0, n = array.length;
		for( ; i < n; i++ ){
			fn(array[i]);
		}
	}


	if( /local/.test(location.toString()) ){
		// include external libs
		forEach(['jquery.dev', 'Pilot', 'xtpl.min'], function (src){
			include('/js/' + src);
		});


		// Build Soul
		forEach(['', 'defer', 'http', 'Emitter', 'Model', 'Collection', 'Storage', 'Tabs', 'Hub', 'User'], function (name){
			if( name ){
				name = '.' + name;
			}
			include('/Soul/src/Soul'+ name);
		});
	}
	else {
		forEach([
			  '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min'
			, '//rubaxa.github.io/Pilot/Pilot'
			, '//xtpl.ru/js/xtpl.min'
			, '../../dist/Soul.client.min'
		], function (src){
			include(src);
		});
	}
})();
