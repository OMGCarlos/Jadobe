jadobe.extend({
	command: 'test test1',
	flags: 'test3',
	run: function(obj){
		console.log(obj);
	},
	init: function(){console.log('Initializing command'); },
	loaded: function(){console.log('finished')}
});