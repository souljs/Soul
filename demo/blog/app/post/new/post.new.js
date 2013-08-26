Soul.define(function (){
	return	Soul.use('post.edit').extend({
		model: Soul.getCollection('post').newModel(),

		saveChanges: function (){
			return	this.model.clone().save();
		}
	});
});
