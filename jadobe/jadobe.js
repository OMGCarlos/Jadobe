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
	// Command Line
	// 
	// Params:  STRING 	 	cmd 	Command to parse
	// Returns: BOOLEAN 	true/false (success/fail)	
	//=============================================================================
	jadobe.cmd = function(cmd){
		return tokenize(cmd);
	};

	///============================================================================
	// Console Log
	// Takes into account the various environments
	//=============================================================================
	jadobe.log = function(){
		if(arguments.length > 0) logHistory.push(arguments);
		if(JADOBE_ENVIRONMENT.console) console.log(arguments);
		return true;
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
	// Params:  STRING 		str 	String to tokenize
	// Returns: ARRAY 		tokens 	Array containing the tokens
	//=============================================================================
	function tokenize(str){

		return str
	}


/*###########################################################################*/



	///============================================================================
	// Checks if an object is empty
	// 
	// Params: OBJECT 		obj 	The obejct to check
	// Returns: BOOLEAN 	True if empty, false if not
	//=============================================================================
	function isEmpty(obj){
		for(var prop in obj){return false;} return true;
	}

})(JADOBE_ENVIRONMENT.jadobe = JADOBE_ENVIRONMENT.jadobe || {})