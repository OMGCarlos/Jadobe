;/*============================================================================
|			     ____.           .___    ___.           
|			    |    |____     __| _/____\_ |__   ____  
|			    |    \__  \   / __ |/  _ \| __ \_/ __ \ 
|			/\__|    |/ __ \_/ /_/ (  <_> ) \_\ \  ___/ 
|			\________(____  /\____ |\____/|___  /\___  >
|			              \/      \/          \/     \/ 
|
|					Jadobe. JavaScript Everywhere.
|
|******************************************************************************
|
| 							BROWSER EXTENSIONS
|
|******************************************************************************
|
| 	This package contains a list of commands that make the browser itself more
|	useable. With it, you'll be able to:
|
|		* Enter commands through the URL
|
=============================================================================*/
jadobe.extend({
	command: 'test test1',
	flags: 'test3',
	help: 'Echos out hello world',
	run: function(obj){
		//console.log(obj);
		//console.log('hello world');
	},
	init: function(){console.log('Initializing command'); },
	loaded: function(){console.log('finished')}
});