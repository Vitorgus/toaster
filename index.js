const path = require('path');
const Commando = require('discord.js-commando');
//const token = require('./token.js');
const token = process.env.TOKEN;
const bot = new Commando.Client({
    owner: '358366590632460288',
    commandPrefix: 'jarvis ',
    disableEveryone: true
});

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
    console.log('EUERKA!');
    //console.log(guild.availble);
    // Send an emoji:
    // const emoji = guild.emojis.first();
    // msg.reply(`Hello! ${emoji}`);
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
