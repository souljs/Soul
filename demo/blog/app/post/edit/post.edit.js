Soul.define(function (){
	return	Soul.Layer.extend({
		tpl: 'post/edit/post.edit.xtpl',
		model: Soul.getModel('post').byReq({ 'id': 'objectId' }),

		onRouteStart: function (){
			// Save original model
			this.modelCopy = this.model.clone();

			// Set focus
			this.autofocus = Math.random();
		},

		onRouteEnd: function (){
			// Reset changes, if model is nodified
			if( this.model.changed ){
				this.model.set( this.modelCopy.toJSON() );
			}
		},

		/** @protected */
		saveChanges: function (){
			return this.model.save();
		},

		onSave: function (){
			this.saveChanges().done(this.fn(function (){
				this.router.go('post-view', this.model);
			}));
		},

		onCancel: function (){
			var router = this.router;

			if( router.hasBack() ){
				router.back();
			} else {
				router.go('index');
			}
		}
	});
});
