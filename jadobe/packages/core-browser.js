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

///============================================================================
// Runs the browser query string on load
// 
// Todo:
// Multiple jadobe keys. Really, they should all be concacted in a single field,
// 		but this would be more robust.
//=============================================================================
jadobe.extend({
	command: 'runquerystring run?$',
	help: 'Scans the URL for a query string key labeled "jadobe" and executes its value as the command line',
	loaded: function(){
		///============================================================================
		// Grab the command line from the query
		//=============================================================================
	    var queryString = RegExp('[?&]jadobe=([^&]*)')
	                    .exec(window.location.search);
        if(queryString) {
        	jadobe.cmd(decodeURIComponent(queryString[1].replace(/\+/g, ' ')));
        	return true;
        } else return false;
	},
	run: function(){
		return this.loaded;
	}
});