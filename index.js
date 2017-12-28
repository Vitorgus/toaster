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
    bot.user.setAvatar('http://www.jeffbots.com/hal.jpg');
    package = require('./package.json');
    console.log("Starting " + package.name + " " + package.version + "...\nLogged in! I'm now on GitHub!");
    console.log("type "+bot.commandPrefix+"help in Discord for a commands list.");
    bot.user.setStatus("online");
    //bot.user.setGame("JARVIS | jarvis help");
    bot.user.setGame("Type 'jarvis help' for commands");
});

bot.on('unknownCommand', message => {
    //TODO check if emojis collection is not empty
    if (message.content == bot.commandPrefix + "activate eggplant mode"){
        eggplant = true;
        console.log("Eggplant mode activated!");
        message.say("Activated 🍆");
    }
    else if (message.content == bot.commandPrefix + "deactivate eggplant mode"){
        if (message.author.username == "Zorg"){
            message.say(message.guild.emojis.find("name", "cliffsmug").toString());
            return;
        }
        eggplant = false;
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
    /*
    if (message.content == "alo") {
        message.channel.send("<@291235973717688321><:red:362768065202618369>");
    }*/
    if (eggplant && message.author.username == "Zorg"){
        message.react("🍆");
    }
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
