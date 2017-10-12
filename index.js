const path = require('path');
const Commando = require('discord.js-commando');
//const token = require('./token.js');
const token = process.env.TOKEN;
const bot = new Commando.Client({
    owner: '291235973717688321',
    commandPrefix: 'jarvis ',
    disableEveryone: true,
    unknownCommandResponse: false
});

var eggplant = false;

bot.on('ready', () => {
  //console.log('I\'m doing things...');
  //bot.user.setAvatar('http://i.imgur.com/l2KqI3Y.png?1');
  package = require('./package.json');
  console.log("Starting " + package.name + " " + package.version + "...\nLogged in!");
  console.log("type "+bot.commandPrefix+"help in Discord for a commands list.");
  bot.user.setStatus("online");
  bot.user.setGame("JARVIS | jarvis help");
});

bot.on('unknownCommand', message => {
    console.log('EUERKA!'); //TODO remove logs and check if emojis collection is not empty
    console.log("Available: ", message.guild.available);
    if (message.content == bot.commandPrefix + "activate eggplant mode"){
        eggplant = true;
        console.log("Eggplant mode activated!");
        message.say("Activated 🍆");
    }
    else if (message.content == bot.commandPrefix + "deactivate eggplant mode"){
        eggplant = true;
        console.log("Eggplant mode deactivated!");
        message.say("Deactivated 🍆");
    }
    else if (message.guild.available){
        emoji = message.guild.emojis.random();
        message.say(emoji.toString());
    }
    // Send an emoji:
    // const emoji = guild.emojis.first();
    // msg.reply(`Hello! ${emoji}`);
});

bot.on('message', message => {
    if (eggplant){
        console.log("Eggplant!");
    }
    /*
    else if (message.author.username == "Zorg"){
        message.react("🍆");
    }
    */
});

process.on('unhandledRejection', console.error);

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

//Login
bot.login(token);
