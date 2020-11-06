const path = require('path');                       //Gets the system path
const CustomClient = require('./custom_client.js');    //Gets the commando library
const messages = require('./objects/messages.json');
const welcome = messages.welcome; //require('./welcome.json');
const edgelord = process.env.SHILOH_USER_GOODFACE;
const axios = require('axios');
const escapeRegex = require('escape-string-regexp');

//Initializing bot
const bot = new CustomClient({
    owner: '291235973717688321',    // Setting myself as the owner. That's my Discord ID.
    commandPrefix: 'jarvis ',       // Setting the prefix
    disableMentions: 'everyone',    // Allows the bot to use @everyone and @here
    presence: {                     // Set bot status
        status: 'online',
        activity: {
            name: "Type 'jarvis help' for commands",
            type: 'PLAYING'
        }
    }
});

bot.on('ready', () => {
    //bot.user.setAvatar('http://www.jeffbots.com/hal.jpg');            // Sets the avatar image. Disabled cause Discord complains when setting the image too many times.
    let package = require('./package.json');                            // Gets the package.json file
    console.log(`Starting ${package.name} v${package.version}...`);     // Outputs in the log that the bot has started
    //bot.user.setGame("JARVIS | jarvis help");

    /*bot.red_status = bot.guilds.get(process.env.SHILOH_SERVER_ID)
        .members.get(edgelord).presence.status;
    bot.edgy_handler = setInterval(() => {
        if (!bot.reactions_map.get("emo")) {
            clearInterval(bot.edgy_handler);
            return;
        }
        let guild = bot.guilds.get(process.env.SHILOH_SERVER_ID);
        let status = guild.members.get(edgelord).presence.status;
        // console.log("Status = " + status);          //OFF
        // console.log("REd status = " + bot.red_status);//ON
        if (status == bot.red_status) return;
        if (bot.red_status == "offline" && status != "offline"){
        	// let red = bot.quotes_array.find(obj => {
        	//	return obj['name'].includes("red");
        	//});
            guild.channels.get(process.env.SHILOH_CHANNEL_GENERAL)
                .send("https://cdn.discordapp.com/attachments/450067107913269258/456571650146566174/goosface.png"); //Goose image for GoodFace
                //.send(red["quotes"][Math.floor(Math.random() * red["quotes"].length)]); // Sends a random red quote
                //.send("May Shiloh (cat) give you a lot of snuggles\nMay you don't get kidnapped (at least today)\nMay everything goes smoothly in your workplace\nMay your bones don't break due to old age\nMay Shiloh (comic) always attract new readers\nMay all this and much more good stuff happens to you, because I ran out of creativity on what to say\nYou are awesome\n\nHAPPY BIRTHDAY RED!!\n\n https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRMZGJ5Kqr0jaNQ5QCej58t73Tr3jPdM1yH2cTUbMbe9ecs-YTvgT0UbYVx");
                //.send("https://cdn.discordapp.com/attachments/330405008451305472/437787256749686784/cuddle_puddle_time_with_fam.png"); // cuddle puddle
                //.send("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRStal-Dz8WGJxbY-TG37yHbRbEJ_YkckmfKLK6zS0ymm8ddnlogf8a0oN3"); // prinkled donut
                //.send("https://pre00.deviantart.net/0503/th/pre/i/2011/072/0/7/sexy_tomato_by_edome-d3bj8vd.png"); // sexy tomato
                //.send("https://cdn.discordapp.com/attachments/330405008451305472/434818684620374026/unknown.png"); // french girl
                //.send("Crawling up from the pits of deep introspection, wise, yet broken because wisdom of one's own dark, charred soul makes one break down in tears, as deep and depressing as a linkin park song ... IT IS RED. THE EDGIEST BOLSHEVIK.");
        }
        bot.red_status = status;
    }, 5000);*/

    console.log("All set! Ready to roll!");
});

bot.on('unknownCommand', async message => {
    //Check is it's possible to send an emoji
    if (message.editedAt || !message.guild || !message.guild.available || !message.guild.emojis.cache.size) return;
    if (message.guild.id !== process.env.SHILOH_SERVER_ID) {
        console.log("NOT shiloh chat. Getting a random emoji.")
        emoji = message.guild.emojis.cache.random();      // Gets a random custom emoji
        message.say(emoji.toString());              // Says the emoji in the 
        return;
    }
    console.log("Shiloh! Going to send an IA calculated emoji! Message received: " + message.content);
    const escapedPrefix = escapeRegex(bot.commandPrefix);
    let text = RegExp(`^(<@!?${bot.user.id}>\\s+(?:${escapedPrefix},*\\s*)?|${escapedPrefix},*\\s*)([\\s\\S]*)`, 'i').exec(message.content)[2];
    let config = {
        model: 'shiloh',
        text: text
    };
    console.log("Request properties: " + JSON.stringify(config));
    try {
        const res = await axios.post('http://thezorg.pythonanywhere.com/', config)
        console.log("Emoji requested sucessfull! Response = " + res.data);
        let emoji_name = /\[':([\s\S]*):'\]/.exec(res.data)[1];
        let emoji = message.guild.emojis.cache.find(emoji => emoji.name == emoji_name);
        message.say(emoji.toString());
    } catch (e) {
        console.log("Coudn't get emoji from server. Error: " + error.message);
        console.log("Generating a random emoji instead.");
        emoji = message.guild.emojis.cache.random();      // Gets a random custom emoji
        message.say(emoji.toString());              // Says the emoji in the chat
    }

    // THIS CODE IS JUST HERE TO REMIND ME THAT THE FOLOWING IS POSSIBLE
    // const emoji = guild.emojis.first();
    // msg.reply(`Hello! ${emoji}`);

    // THIS CODE IS JUST HERE TO REMIND ME THAT THE FOLOWING IS POSSIBLE
    // if (message.content == "alo") {
    //     message.channel.send("<@291235973717688321><:red:362768065202618369>");
    // }
});

bot.on('guildMemberAdd', member => {
    if (member.guild.id != process.env.SHILOH_SERVER_ID) return; //Checks if it's the Shiloh server
    //Greeting message
    member.guild.channels.cache.find(val => val.name == "general").send(`${member.user} ${welcome[Math.floor(Math.random() * welcome.length)]}`);
    member.roles.add(process.env.SHILOH_ROLE_READER)     //Gives the newcomer the sinners role
        .catch(error => {
            console.log(error);
            member.guild.channels.cache.find(val => val.name == "general").send(`Whoops. Couldn't give you the readers role. Sorry.`);
        });
    
});

process.on('unhandledRejection', (reason, p) => {               // ...I guess this line is important, but I don't know why
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

let shutdown = async () => {
    console.log(`Shutdown imminent!`);
    await bot.user.setStatus("dnd");
    //bot.user.setGame("Updating...");
    process.exit();
}

process.on('SIGTERM', shutdown);

process.on('SIGINT', shutdown);

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
        ['shiloh', 'Shiloh Server Commands'],
        ['other', 'Other Useful Commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({ unknownCommand: false })
    .registerCommandsIn(path.join(__dirname, 'commands'));

//Login into discord. WHy is this line in the bottom of the code?
bot.login(process.env.TOKEN_DISCORD_LOGIN);

/*
PS: removed erlpack from package.json, but just in case the bot crashes, here it is
    "erlpack": "github:hammerandchisel/erlpack",
*/
