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
|******************************************************************************
|
|	If you'd like to help out, but not sure where to start, simply search for
|	one of the following strings and see if you can help me out:
|	
|	SEARCH STRING 		| COUNT	| DESCRIPTION
|______________________________________________________________________________
|	#QUESTION 			|   0	| Inline questions.
|	#TODO				|   0	| To be done whenever
|	#TODO-NEXT			|   0	| To be done immediately
=============================================================================*/



/*###########################################################################*/



var JADOBE_ENVIRONMENT = window,	//Change to match your environments global object:
										//window 	= Web Browsers
	JADOBE_CONSOLE_LOG = console.log; 	//The environments console display function

///============================================================================
// Let's effin do this!
//=============================================================================
(function(jadobe, undefined){
	///============================================================================
	// Private Properties
	//=============================================================================
	var	logHistory = [];	//Stores a history of console logs

	///============================================================================
	// Public Properties
	//=============================================================================
	jadobe.debug = {
		warnings: 	true,	//Display warnings?
		notices: 	true 	//Display notices?
	}


/*###########################################################################*/


	///============================================================================
	// Command Line
	// 
	// Arguments: 	STRING 	 	cmd 	Command to parse
	// Returns: 	BOOLEAN 	true/false (success/fail)	
	//=============================================================================
	jadobe.cmd = function(cmd){
		return tokenize(cmd);
	};



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
				if(token.replace(/\s/g, "") !== '') tokens.push(token + chr);
			}

			token += chr;
		}

		return tokens
	}


/*###########################################################################*/



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