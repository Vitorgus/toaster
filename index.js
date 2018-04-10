const path = require('path');                       //Gets the system path
const Commando = require('discord.js-commando');    //Gets the commando library
const token = process.env.TOKEN;                    //Gets the SUPER SECRET BOT TOKEN from the hosting enviroment
const Enmap = require('enmap');                     //Gets the enmap. Basically a simple database.
const https = require('https');
const messages = require('./messages.json');
const welcome = messages.welcome; //require('./welcome.json');
const stream = messages.stream;
const edgelord = "Vitorgus";//"RED";

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
    bot.generaldb.set("emo", true);
    bot.red_status = bot.users.find("username", edgelord).presence.status;
    bot.music = {};
    bot.stream_status = false;
    bot.stream_timer = setInterval(checkStream, 30000); //30000
    console.log("Logged in!");
    bot.edgy_handler = setInterval(() => {
        if (!bot.generaldb.set("emo")) {
            clearInterval(bot.edgy_handler);
            return;
        }
        let status = bot.users.find("username", edgelord).presence.status;
        console.log("Status = " + status);          //OFF
        console.log("REd status = " + bot.red_status);//ON
        if (status == bot.red_status) return;
        if (bot.red_status == "invisible" && status != "invisible")
        /*
            bot.guilds.get(process.env.SHILOH_CHAT)
                .channels.get(process.env.SHILOH_GENERAL)
                .send("Crawling up from the pits of deep introspection, wise, yet broken because wisdom of one's own dark, charred soul makes one break down in tears, as deep and depressing as a linkin park song ... IT IS RED. THE EDGIEST BOLSHEVIK.");
        */
            bot.guilds.get(process.env.TEST_CHAT)
                .channels.get(process.env.TEST_CHANNEL)
                .send("Teste");
        bot.red_status = status;
    }, 5000);
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
                if (offline) {
                    bot.stream_status = rnf.online;
                    bot.stream_timer = setInterval(checkStream, 30000);
                    if (!rnf.online) console.log("Stream is off");
                    return;
                }
                if (bot.stream_status === rnf.online) return;
                if (rnf.online) {
                    bot.stream_status = true;
                    bot.guilds.get(process.env.SHILOH_CHAT)
                        .channels.get(process.env.SHILOH_GENERAL)
                        .send(`${stream[Math.floor(Math.random() * stream.length)]} https://picarto.tv/REDnFLYNN`);
                    return;
                }
                clearInterval(bot.stream_timer);
                setTimeout(checkStream.bind(null, true), 300000); //300000
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

process.on('SIGTERM', () => {
    console.log(`SIGTERM shutdown imminent!`);
    bot.user.setStatus("dnd");
    //bot.user.setGame("Updating...");
    process.exit();
});
/*
process.on('exit', code => {
  console.log(`About to exit with code: ${code}`);
});
*/
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
