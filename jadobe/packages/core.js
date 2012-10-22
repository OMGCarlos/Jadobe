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
| 							CORE EXTENSIONS
|
|******************************************************************************
|
| 	These are the Core extensions. The goal is to keep jadobe.js as lightweight
| 	as possible, and we do this by making everything a command.
|
|		* Help
|
=============================================================================*/

///============================================================================
// Help
//=============================================================================
jadobe.extend({
	command: 'help ?',
	flags: 'v',
	help: 'Displays a list of all available commands. To get help on specific\n\
commands, enter the command or its alias followed a ?.\n\n\
FLAGS:\n\
	-v : [-v]erbose mode. Will display a detailed overview of all available\n\
			commands.\n', 

	run: function(cmd){
		///============================================================================
		// Display Commands
		//=============================================================================
		var commands = jadobe.commands().sort(),
			verbose = jadobe.inArray('v', cmd.flags);
		for(var i = 0; i < commands.length; i++){
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Verbose
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			if(verbose) jadobe.log( '[ ' + commands[i].tokens[0] + ' ]\n' + commands[i].help + '\n=============================================================================\n');
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// Simple
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			else jadobe.log(commands[i].tokens[0]);
		}
	}
});