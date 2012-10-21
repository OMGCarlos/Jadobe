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
| 				*** TAKE CARE IN EDITING THIS FILE ***
| 	You could destroy the site, the internet, and yourself!
|
|	Any changes done on this file will likely get overwritten on the next update
|	anyways...
|
|	...unless you contribute! Add a pull request here: 
|	https://github.com/OMGCarlos/Jadobe
|
=============================================================================*/



/*###########################################################################*/



var JADOBE_ENVIRONMENT = window,		//Change to match your environments global object:
											//window = Web Browsers
	JADOBE_CONSOLE_LOG = console.log; 	//The environments console display function
											//console.log = Web Browser

///============================================================================
// Let's effin do this!
//=============================================================================
(function(jadobe, undefined){
	///============================================================================
	// Private Properties
	//=============================================================================
	var	logHistory = [],	//Stores a history of console logs
		commands = [];		//Stores a collection of command objects

	///============================================================================
	// Public Properties
	//=============================================================================
	jadobe.debug = {
		warnings: 	true,			//Display warnings?
		notices: 	true 			//Display notices?
	}
	jadobe.security = {
		protectCommands: false, 		//Prevent overwritting existing commands?
		strictMode: true
	}


/*###########################################################################*/


	///============================================================================
	// Command Line
	// 
	// Arguments: 	STRING 	 	cmd 	Command to parse
	// Returns: 	BOOLEAN 	true/false (success/fail)	
	//=============================================================================
	jadobe.cmd = function(cmd){
		var tokens = [],		//List of tokens without flags
			flags = [],			//List of flags with the flags
			queriedHelp = false;	//Determines is asking for help through ?

		///============================================================================
		// Tokenize and extract flags
		//=============================================================================
		tokens = tokenize(cmd);
		for(var i = 0; i < tokens.length; i++){
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Halt on question mark
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			if(tokens[i] === '?') {
				queriedHelp = true;
				break;
			}

			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Extract Flags
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			if(tokens[i][0] === '-'){
				flags.push(tokens[i].substring(1, tokens[i].length));	//Grab the flag, without the hyphen-minus
				tokens.splice(i, 1);	//Remove the flag from the token
				i -= 1;
			}
		}

		///============================================================================
		// Find a matching command
		// 
		// We will check all commands and their aliases.
		// If an alias is matched, we need to keep searching incase a command with a
		// similar name is found.
		//=============================================================================
		var command, 	//The command object matched
			alias;		//The command object of the alias matched.
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Look through each command
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		for(i = 0; i < commands.length; i++){
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Look through each token
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			for(var k = 0; k < commands[i].tokens.length; k++){
				if(commands[i].tokens[k] === tokens[0]){
					if(k === 0) {
						command = commands[i];
						break;
					} else alias = commands[i];
				}
			}
		}

		///============================================================================
		// Warning if no command found
		//=============================================================================
		if(!(command = command || alias)) {
			jadobe.warning('Warning 008: Command not loaded > ', tokens[0]);
			return false;
		///============================================================================
		// Exit and show help
		//=============================================================================
		} else if(queriedHelp) {
			jadobe.log(command.help);
			return false;
		}

		///============================================================================
		// Validate flags
		//=============================================================================
		var extraFlags = [],	//List of flags not defined by the extension
			foundFlag = false;	//Determines if a match was found
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Look through user inputed flags
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		for(i = 0; i < flags.length; i++){
			foundFlag = false;
			//console.log(flags[i]);
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Look through commands defined flags
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			for(k = 0; k < command.flags.length; k++){
				if(flags[i] === command.flags[k]){
					foundFlag = true;
					break;
				}
			}

			///============================================================================
			// If no match was found, extract the flag from flags into extraFlags
			//=============================================================================
			if(!foundFlag){
				extraFlags.push( flags.splice(i, 1)[0] );
				i -= 1;
			} 
		}

		///============================================================================
		// Warning if we have extra flags and the strictMode is set
		//=============================================================================
		if(command.strictMode && extraFlags.length > 0){
			jadobe.warning('Warning 007: Unknown flags > ', extraFlags);
			return false;
		}

		///============================================================================
		// Finally build the object, and pass it to the run event
		//=============================================================================
		command.run({
			tokens: 		tokens,
			flags: 			flags,
			extraFlags: 	extraFlags
		});

		return true;
	};


/*###########################################################################*/


	///============================================================================
	// Extend Jadobe
	// 
	// Arguments: 	OBJECT/FUNCTION 	cmd 	The extending command
	// Returns: 	BOOLEAN 			pass/fail
	//=============================================================================
	jadobe.extend = function(cmd){
		if(typeof cmd === 'undefined') return false;

		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Make sure we get an object
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if(typeof cmd === 'function') cmd = cmd();	//Extract object from function
		if(typeof cmd !== 'object'){
			jadobe.warning('Warning 002: Failed to extend Jadobe with > ', cmd);
			return false;
		}
		///============================================================================
		// Make sure we have required methods/properties
		//=============================================================================
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Command
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if(typeof cmd.command === 'undefined') {
			jadobe.warning('Warning 004: Failed to extend Jadobe. The "command" property is missing.');
			return false;
		}
		if(typeof cmd.command !== 'string') {
			cmd.command = cmd.command.toString();
			jadobe.notice('Notice 001: Extending with a non-string command > ', cmd.command);
			return false;
		}
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Run
		//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if(typeof cmd.run === 'undefined'){
			jadobe.warning('Warning 005: Failed to extend Jadobe. Missing method "run".');
			return false;
		}

		///============================================================================
		// Tokenize the command
		//=============================================================================
		cmd.tokens = tokenize(cmd.command);

		///============================================================================
		// Set default values
		//=============================================================================
		if(typeof cmd.protected === 'undefined') cmd.protected = false;

		///============================================================================
		// Check if the command exists, and if it does, replace it
		//=============================================================================
		var isDuplicate = false,	//Does a duplicate command exist?
			initialize = true;		//Should we call the initialize function? This is set to false if a warning 
										//gets issued when checking for duplicates
		for(var i = 0; i < commands.length; i++){
			if(commands[i].command === cmd.tokens[0]){
				isDuplicate = true;
				break;
			}
		}

		///============================================================================
		// Initialize function, or return an error if the initializer fails
		//=============================================================================
		if(initialize && typeof cmd.init !== 'undefined'){
			var warning = cmd.init();
			if(typeof warning === 'string'){
				jadobe.warning('Warning 003: Failed to extend Jadobe during initialization > ', cmd.command, warning);
				return false;
			}
		}

		///============================================================================
		// Setup Defaults
		//=============================================================================
		cmd.flags = tokenize(cmd.flags || '');
		cmd.strictMode = cmd.strictMode || jadobe.security.strictMode;
		cmd.protected = cmd.protected || jadobe.security.protected;
		cmd.help = cmd.help || 'Sorry, no help was found for this command.';


		///============================================================================
		// Add the command
		//=============================================================================
		if(!isDuplicate) commands.push(cmd);
		else{
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Warning if this command is protected
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			if(commands[i].protected){
				jadobe.warning('Warning 006: Command cannot be overwritten > ', commands[i].command);
				initialize = false;
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// ...notice if not
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			} else {
				jadobe.notice('Notice 002: Command overwritten > ', commands[i].command);
				commands[i] = cmd;
			}			
		}

		///============================================================================
		// Execute the loaded script
		//=============================================================================
		contentLoaded(window, function(){
			if(typeof cmd.loaded !== 'undefined'){
				var notice = cmd.loaded();
				if(typeof notice === 'string'){
					jadobe.notice('Notice 003: Error when calling the loading script for ' + cmd.tokens[0] + ' > ', notice);
				}
			}
		});

		return true;
	}


/*###########################################################################*/


	///============================================================================
	// Console Log
	// Takes into account the various environments
	// 
	// Arguments: 	Various 	Can take in any number of arguments of any type
	// Returns: 	True
	//=============================================================================
	jadobe.log = function(){
		if(arguments.length > 0) logHistory.push(arguments);
		if(JADOBE_ENVIRONMENT.console) {
			switch(arguments.length){
				case 1: console.log(arguments[0]); break;
				case 2: console.log(arguments[0], arguments[1]); break;
				case 3: console.log(arguments[0], arguments[1], arguments[2]); break;
				default: console.log(arguments); break;
			}
		}
		return true;
	}

	///============================================================================
	// Throws warning to the console
	// Returns: 	jadobe.debug.warnings
	//=============================================================================
	jadobe.warning = function(){
		if(!jadobe.debug.warnings) return false;
		else{
			switch(arguments.length){
				case 1: jadobe.log(arguments[0]); break;
				case 2: jadobe.log(arguments[0], arguments[1]); break;
				case 3: jadobe.log(arguments[0], arguments[1], arguments[2]); break;
				default: jadobe.log(arguments); break;
			}
			return true;
		}
	}

	///============================================================================
	// Throws warning to the console
	// Returns: 	jadobe.debug.warnings
	//=============================================================================
	jadobe.notice = function(){
		if(!jadobe.debug.notices) return false;
		else{
			switch(arguments.length){
				case 1: jadobe.log(arguments[0]); break;
				case 2: jadobe.log(arguments[0], arguments[1]); break;
				case 3: jadobe.log(arguments[0], arguments[1], arguments[2]); break;
				default: jadobe.log(arguments); break;
			}
			return true;
		}
	}

	///============================================================================
	// Display entire console history
	//=============================================================================
	jadobe.logHistory = function(){
		for(var i = 0; i < logHistory.length; i++){
			if(JADOBE_ENVIRONMENT.console) console.log(logHistory[i]);
		}
		return true;
	}


/*###########################################################################*/



	///============================================================================
	// Tokenize a string
	// 
	// Arguments: 	STRING 		str 	String to tokenize
	// Returns: 	ARRAY 		tokens 	Array containing the tokens
	//=============================================================================
	function tokenize(str){
		str = str.toString();	//This MUST be a string, or weird things could happen

		var tokens = [],	
			token = '',		//Each loop adds a character to token, until a deliminator is met
			chr = '';		//Stores the current character

		for(var i = 0; i < str.length; i ++){
			chr = str[i];

			///============================================================================
			// Group single quotes
			//=============================================================================
			if(chr === "'"){
				var substr = str.substring(i+1),			//"slice" the string at the current position
					nextQuote = substr.indexOf("'");	//Look for the next instance of a single quote

				///============================================================================
				// Warning, closing quote not found
				//=============================================================================
				if(nextQuote === -1){
					jadobe.warning('Warning 001: Single quote used at position ', i, ' with no closing quote!');
					return false;
				}

				chr = '';
				token = '';
				tokens.push(substr.substring(0, nextQuote));
				i += ++nextQuote;	//Skip to this position
			}

			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Add token when a space is met
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			if(chr === ' '){
				if(token.replace(/\s/g, "") !== '') tokens.push(token);
				chr = '';
				token = '';
			}
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Add token when end of string is reached
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			if(i === str.length-1){
				if(chr === ' ') chr = '';
				if((token + chr).replace(/\s/g, "") !== '') tokens.push(token + chr);
			}

			token += chr;
		}

		return tokens;
	}



/*###########################################################################*/

	
	///============================================================================
	// Content loaded
	// https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
	//=============================================================================
	function contentLoaded(win, fn) {

		var done = false, top = true,

		doc = win.document, root = doc.documentElement,

		add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
		rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
		pre = doc.addEventListener ? '' : 'on',

		init = function(e) {
			if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
			(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
			if (!done && (done = true)) fn.call(win, e.type || e);
		},

		poll = function() {
			try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
			init('poll');
		};

		if (doc.readyState == 'complete') fn.call(win, 'lazy');
		else {
			if (doc.createEventObject && root.doScroll) {
				try { top = !win.frameElement; } catch(e) { }
				if (top) poll();
			}
			doc[add](pre + 'DOMContentLoaded', init, false);
			doc[add](pre + 'readystatechange', init, false);
			win[add](pre + 'load', init, false);
		}

	}


	///============================================================================
	// Checks if an object is empty
	// 
	// Arguments: 	OBJECT 		obj 	The obejct to check
	// Returns: 	BOOLEAN 	True if empty, false if not
	//=============================================================================
	function isEmpty(obj){
		for(var prop in obj){return false;} return true;
	}

})(JADOBE_ENVIRONMENT.jadobe = JADOBE_ENVIRONMENT.jadobe || {})