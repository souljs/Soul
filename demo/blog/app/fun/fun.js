Soul.define(function (){
	return Soul.Layer.extend({
		tpl: 'fun/fun.xtpl',

		onSubsribe: function (){
			this.step = 'subscribe.done';
		}
	});
});
