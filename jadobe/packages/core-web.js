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
| 							CORE: WEB Extensions
|
|******************************************************************************
|
| 	This package contains a list of commands that make surfing the net easier,
|		as well as the very useful runquerystring process. This package will allow
|		you to do the following:
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
	help: 'Scans the URL for a query string key labeled "jadobe" and executes its value as the command line\n\n\
- - - - - - - - - -\n\
ALIAS:\n\
	run?$\n',
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

///============================================================================
// Change the URL
//=============================================================================
jadobe.extend({
	command: 'url',
	flags: 'n',

	help: 'Navigates to the new URL in the same tab by default.\n\
If multiple URLs are provided the first will open in the same tab, with the\n\
rest opening in separate tabs.\n\
\n\
URLs are relative.\n\
\n\
The following modifiers are available:\n\
A * token will be replaced with the current URL.\n\
[*] gets replaced with the current URL.\n\
[!] gets replaced with the root URL.\n\n\
- - - - - - - - - -\n\
FLAGS:\n\
	-n: Will open ALL URLs in [-n]ew tabs.\n\n\
- - - - - - - - - -\n\
EXAMPLES:\n\
url *\n\
 > refresh current page\n\n\
url http://jadobe.com [!]/manual/url\n\
 > loads Jadobe in the current window, and opens ROOT/manual/url in a tab\n\n\
url -n *\n\
 > loads the current page in a new tab\n\
',

	run: function(cmd){
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Not enough parameters
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if(cmd.tokens.length === 1){
			jadobe.warning('Warning: url requires at least one URL');
			return false;
		}

		var newTab = jadobe.indexOf('n', cmd.flags) !== -1 ? '_newtab' : '_self';	//Set the location of the first URL

		///============================================================================
		// Parse the URLs for special cases, and then execute them
		// 
		// A * token will be replaced with the current url
		// [*] replaced with current URL
		// [!] replaced with root URL
		//=============================================================================
		for(var i = 1; i < cmd.tokens.length; i++){
			cmd.tokens[i] = cmd.tokens[i] === '*' ? document.URL : cmd.tokens[i];						// *
			cmd.tokens[i] = cmd.tokens[i].replace(/\[\*\]/g, document.URL)								// [*]
										 .replace(/\[\!\]/g, document.URL.match(/:\/\/(.[^/]+)/)[1] );	//[!]

			if(i === 1) window.open(cmd.tokens[i], newTab);
			else window.open(cmd.tokens[i], newTab + i);
		}
	}
})