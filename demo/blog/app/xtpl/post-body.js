Soul.define(function (){
	Soul.xtpl.decl('x-post-body', function (el, code){
		code = code
			.replace(/```(\w+)([\s\S]*?)```/g, function (_, lang, code){
				code = code.replace(/</g, '&lt;').replace(/>/, '&lt;').trim();
				code = '<pre data-highlight-lang="'+ lang +'"><code>'+ code +'</code></pre>';
				return code;
			})
			.replace(/\b(https?:\/\/[^'"\s]+)/g, '<a href="$1">$1</a>')
			.replace(/\n/g, '<br/>')
			.replace(/\s\s\s/g, ' &nbsp; ')
		;

		el.innerHTML = code;

		$('[data-highlight-lang]', el).each(function (i, el){
			var type = $.attr(el, 'data-highlight-lang');
			el.className += ' language-' + (type == 'js' ? 'javascript' : type);
			window.hljs && hljs.highlightBlock(el);
		});
	});
});
