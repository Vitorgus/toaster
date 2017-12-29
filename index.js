const path = require('path');
const Commando = require('discord.js-commando');
const token = process.env.TOKEN;

//Initializing bot
const bot = new Commando.Client({
    owner: '291235973717688321',    // Setting myself as the owner. That's my Discord ID.
    commandPrefix: 'jarvis ',       // Setting the prefix
    disableEveryone: true,          // Allows the bot to use @everyone and @here
    unknownCommandResponse: false   // Disable the default unknown command response, So that it can reply with a random custom emoji later on the code
});

var eggplant = false;   //Variable that keeps track if it is to eggplant Zorg or not


/*
Code that will be executed when the bot is initialized.
It mostly just set some things and logs that the bot is online
*/
bot.on('ready', () => {
    bot.user.setAvatar('http://www.jeffbots.com/hal.jpg');                                  // Sets the avatar image
    package = require('./package.json');                                                    // Gets the package.json file
    console.log("Starting " + package.name + " " + package.version + "...\nLogged in!");    // Outputs in the log that the bot has started
    console.log("type "+bot.commandPrefix+"help in Discord for a commands list.");          // Same as above
    bot.user.setStatus("online");                                                           // Sets bot status
    //bot.user.setGame("JARVIS | jarvis help");
    bot.user.setGame("Type 'jarvis help' for commands");                                    // Sets bot game
});

/*
Code that will be executed when jarvis gets a command that doesn't exists.
First, it will check if it is one of the commands to activate or deactivate eggplant mode.
If not, he will reply with a random custom emoji.
NOTE: If there's no custom emoji, he does nothing.
*/
bot.on('unknownCommand', message => {
    //TODO check if emojis collection is not empty
    //TODO eggplant command with emap
    if (message.content == bot.commandPrefix + "activate eggplant mode"){   // Check if it is the command to activate the eggplant
        eggplant = true;                                                    // Activates
        console.log("Eggplant mode activated!");                            // Logs it
        message.say("Activated 🍆");                                         // Sends a message confirming the activation
    }
    else if (message.content == bot.commandPrefix + "deactivate eggplant mode"){        // Check if it is the command to deactivate the eggplant
        if (message.author.username == "Zorg"){                                         // If Zorg is trying to theactiate the eggplant
            message.say(message.guild.emojis.find("name", "cliffsmug").toString());     // Respond with a cliffsmug
            return;                                                                     // Exits the code
        }                                                                               // If it wasn't Zorg, then the code continues
        eggplant = false;                                                               // Deactivates
        console.log("Eggplant mode deactivated!");                                      // Logs it
        message.say("Deactivated 🍆");                                                   // Sends a message confirming it
    }                                               // If it wasn't any of the two commands, then...
    else if (message.guild && message.guild.available && Object.keys(message.guild.emojis).length){
        /*
        The line above checked 3 things:
            1. If the channel is a guild (it won't send a custom emoji in a DM, cause it's impossible)
            2. If the bot is able to send messages to the guld
            3. If it exists custom emojis
        If all the three things are true, then...
        */
        emoji = message.guild.emojis.random();      // Gets a random custom emoji
        message.say(emoji.toString());              // Says the emoji in the chat
    }
    /* THIS CODE IS JUST HERE TO REMIND ME THAT THE FOLOWING IS POSSIBLE
    // Send an emoji:
    const emoji = guild.emojis.first();
    msg.reply(`Hello! ${emoji}`);
    */
});


/*
Coda that will be executed when a message is send.
It happens for every message that appears in a server the bot is in.
This just serves to eggplant zorg if the eggplant mode is active.
*/
bot.on('message', message => {
    /* THIS CODE IS JUST HERE TO REMIND ME THAT THE FOLOWING IS POSSIBLE
    if (message.content == "alo") {
        message.channel.send("<@291235973717688321><:red:362768065202618369>");
    }*/
    if (!eggplant) return;                      // If the mode is deactivated, stop
    if (message.author.username == "Zorg"){     // If it gets here, then it is activated, so it checks if the sender os the message is Zorg
        message.react("🍆");                     // If yes, the reacts with an eggplant
    }
});

process.on('unhandledRejection', console.error);    // ...I guess this line is important, but I don't know why

// Registers the commands for the bot and divide them in their categories
bot.registry
    .registerDefaultTypes()
    .registerGroups([
        ['music', 'Music Commands'],
        ['polls', 'Poll Commands'],
        ['fun', 'Fun Commands'],
        ['search', 'Search Commands'],
        ['util', 'Utility Commands'],
        ['other', 'Other Useful Commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

//Login into discord. WHy is this line in the bottom of the code?
bot.login(token);
