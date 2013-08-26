(function (Soul){
	Soul.create({
		el: '#main',

		output: '',
		history: [],

		onKey: function (key){
			var action = $.camelCase(key.toLowerCase());

			if( this[action] ){
				this[action]();
			}
			else {
				this.history.push(this.output);
				this.output += key;
			}
		},

		undo: function (){
			this.output = this.history.pop();
		},

		cancel: function (){
			this.output		= '';
			this.history	= [];
		},

		calcEquals: function (){
			if( this.output != '' ){
				try {
					var result = (new Function('return '+this.output))();
					if( result != this.output ){
						this.history.push(this.output);
						this.output = result;
					}
				}
				catch( e ){}
			}
		}
	}).start();
})(Soul);
