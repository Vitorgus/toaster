const path = require('path');                       //Gets the system path
const Commando = require('discord.js-commando');    //Gets the commando library
const token = process.env.TOKEN;                    //Gets the SUPER SECRET BOT TOKEN from the hosting enviroment
const Enmap = require('enmap');                     //Gets the enmap. Basically a simple database.
const https = require('https');
const welcome = require('./welcome.json');

//Initializing bot
const bot = new Commando.Client({
    owner: '291235973717688321',    // Setting myself as the owner. That's my Discord ID.
    commandPrefix: 'jarvis ',       // Setting the prefix
    disableEveryone: true,          // Allows the bot to use @everyone and @here
    unknownCommandResponse: false   // Disable the default unknown command response, So that it can reply with a random custom emoji later on the code
});

bot.on('ready', () => {
    //bot.user.setAvatar('http://www.jeffbots.com/hal.jpg');            // Sets the avatar image. Disabled cause Discord complains when setting the image too many times.
    package = require('./package.json');                                // Gets the package.json file
    console.log(`Starting ${package.name} v${package.version}...`);     // Outputs in the log that the bot has started
    bot.user.setStatus("online");                                       // Sets bot status
    //bot.user.setGame("JARVIS | jarvis help");
    bot.user.setGame("Type 'jarvis help' for commands");                // Sets bot game
    bot.generaldb = new Enmap();                                        // Sets the "database" in the bot, so it can be accessed inside the functions
    bot.generaldb.set("eggplant", false);                               // Sets initial eggplant vallue to false
    bot.generaldb.set("victim", "Zorg");                                // Sets the name of the eggplant vicim. Love ya, Zorg.
    bot.music = {};
    bot.stream_status = false;
    bot.stream_timer = setInterval(checkStream, 30000); //30000
    console.log("Logged in!");
});

bot.on('unknownCommand', message => {
    //Check is it's possible to send an emoji
    if (message.editedAt || !message.guild || !message.guild.available || !message.guild.emojis.size) return;
    emoji = message.guild.emojis.random();      // Gets a random custom emoji
    message.say(emoji.toString());              // Says the emoji in the chat
    /* THIS CODE IS JUST HERE TO REMIND ME THAT THE FOLOWING IS POSSIBLE
    const emoji = guild.emojis.first();
    msg.reply(`Hello! ${emoji}`);
    */
});

bot.on('message', message => {
    /* THIS CODE IS JUST HERE TO REMIND ME THAT THE FOLOWING IS POSSIBLE
    if (message.content == "alo") {
        message.channel.send("<@291235973717688321><:red:362768065202618369>");
    }*/
    let eggplant = bot.generaldb.get("eggplant")    // Gets the state from de DB
    if (!eggplant) return;                          // If the mode is deactivated, stop
    let name = bot.generaldb.get("victim");         // Gets the name of the eggplant victim
    if (message.author.username == name){           // If it gets here, then it is activated, so it checks if the sender os the message is Zorg
        message.react("🍆");                         // If yes, the reacts with an eggplant
    }
});

bot.on('guildMemberAdd', member => {
    if (member.guild.id != process.env.SHILOH_CHAT) return; //Checks if it's the Shiloh server
    //Greeting message
    member.guild.channels.find("name", "general").send(`${member.user} ${welcome[Math.floor(Math.random() * welcome.length)]}`);
    member.addRole(process.env.SINNER_ROLE)     //Gives the newcomer the sinners role
        .catch(error => {
            console.log(error);
            member.guild.channels.find("name", "general").send(`Whoops. Couldn't give you the sinners role. Sorry.`);
        });
});

function checkStream(offline) {
    console.log("Offline var = " + offline);
    https.get('https://api.picarto.tv/v1/channel/name/REDnFLYNN', res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error("Error with GET request: " + error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const rnf = JSON.parse(rawData);
                if (offline && !rnf.online) {
                    bot.stream_status = false;
                    bot.stream_timer = setInterval(checkStream, 30000);
                    console.log("Stream is off");
                    return;
                }
                if (bot.stream_status === rnf.online) return;
                if (rnf.online) {
                    bot.stream_status = true;
                    bot.guilds.get(process.env.GUILD_TEST)
                        .channels.get(process.env.CHANNEL_TEST)
                        .send("Stream is on! https://picarto.tv/REDnFLYNN");
                    return;
                }
                clearInterval(bot.stream_timer);
                setTimeout(checkStream.bind(null, true), 60000); //300000
                //console.log(rnf);
            } catch (e) {
                console.error("Error while parsing JSON: " + e.message);
            }
            });
        }).on('error', (e) => {
            console.error(`Error with GET response: ${e.message}`);
        });
}

process.on('unhandledRejection', (reason, p) => {               // ...I guess this line is important, but I don't know why
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

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

/*
PS: removed erlpack from package.json, but just in case the bot crashes, here it is
    "erlpack": "github:hammerandchisel/erlpack",
*/
