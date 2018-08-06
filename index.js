const path = require('path');                       //Gets the system path
const Commando = require('discord.js-commando');    //Gets the commando library
const token = process.env.TOKEN;                    //Gets the SUPER SECRET BOT TOKEN from the hosting enviroment
const Enmap = require('enmap');                     //Gets the enmap. Basically a simple database.
const https = require('https');
const http = require('http');
const messages = require('./messages.json');
const welcome = messages.welcome; //require('./welcome.json');
const stream = messages.stream;
const edgelord = process.env.GOODFACE;

//Initializing bot
const bot = new Commando.Client({
    owner: '291235973717688321',    // Setting myself as the owner. That's my Discord ID.
    commandPrefix: 'jarvis ',       // Setting the prefix
    disableEveryone: true,          // Allows the bot to use @everyone and @here
    unknownCommandResponse: false   // Disable the default unknown command response, So that it can reply with a random custom emoji later on the code
});

bot.on('ready', () => {
    //bot.user.setAvatar('http://www.jeffbots.com/hal.jpg');            // Sets the avatar image. Disabled cause Discord complains when setting the image too many times.
    bot.package = require('./package.json');                            // Gets the package.json file
    console.log(`Starting ${bot.package.name} v${bot.package.version}...`);// Outputs in the log that the bot has started
    bot.user.setStatus("online");                                       // Sets bot status
    //bot.user.setGame("JARVIS | jarvis help");
    bot.user.setGame("Type 'jarvis help' for commands");                // Sets bot game
    bot.GetQuotes = getQuotes;                                          // I have no idea if this will work
    bot.GetQuotes();                                                    // Also have no idea if it will work
    //bot.quotes_array = require('./quotes.json');						// Load quotes
    bot.generaldb = new Enmap();                                        // Sets the "database" in the bot, so it can be accessed inside the functions
    bot.generaldb.set("eggplant", false);                               // Sets initial eggplant vallue to false
    bot.generaldb.set("victim", "Zorg");                                // Sets the name of the eggplant vicim. Love ya, Zorg.
    bot.generaldb.set("apple", false);                                  // Sets initial tomato vallue to false
    bot.generaldb.set("victim2", "RED");                           // Sets the name of the tomato vicim. Love ya, Red.
    bot.generaldb.set("emo", false);
    bot.red_status = bot.guilds.get(process.env.SHILOH_CHAT)
        .members.get(edgelord).presence.status;
    bot.music = {};
    bot.stream_status = null;
    bot.stream_timer = setInterval(checkStream, 30000); //30000
    bot.moon = null;
    checkMoon();
    //getQuotes();
    bot.edgy_handler = setInterval(() => {
        if (!bot.generaldb.get("emo")) {
            clearInterval(bot.edgy_handler);
            return;
        }
        let guild = bot.guilds.get(process.env.SHILOH_CHAT);
        let status = guild.members.get(edgelord).presence.status;
        /*
        console.log("Status = " + status);          //OFF
        console.log("REd status = " + bot.red_status);//ON
        */
        if (status == bot.red_status) return;
        if (bot.red_status == "offline" && status != "offline"){
        	/*let red = bot.quotes_array.find(obj => {
        		return obj['name'].includes("red");
        	});*/
            guild.channels.get(process.env.SHILOH_GENERAL)
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
    }, 5000);
    console.log("All set! Ready to roll!");
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
    if (message.channel.id == process.env.MOD_CHAT) return;
    let eggplant = bot.generaldb.get("eggplant")    // Gets the state from de DB
    let apple = bot.generaldb.get("apple")
    if (eggplant) {
        let name = bot.generaldb.get("victim");         // Gets the name of the eggplant victim
        if (message.author.username == name){           // If it gets here, then it is activated, so it checks if the sender os the message is Zorg
            message.react("🍆");                         // If yes, the reacts with an eggplant
        }
    }
    if (apple) {
        let name = bot.generaldb.get("victim2");         // Gets the name of the apple victim
        if (message.author.username == name){           // If it gets here, then it is activated, so it checks if the sender os the message is Red
            message.react("🍎");                         // If yes, the reacts with a apple
        }
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
            error = new Error('Picarto API: Request Failed.\n' +
            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Picarto API: Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error("Error with stream GET request: " + error.message);
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
                if (bot.stream_status === null) {
                    bot.stream_status = rnf.online;
                    console.log("Stream status initialized as " + bot.stream_status);
                    return;
                }
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
                console.error("Error while parsing stream JSON: " + e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Error with stream GET response: ${e.message}`);
    });
}

function checkMoon() {
    http.get('http://isitfullmoon.com/api.php?format=json', res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('IsitFullMoon API: Request Failed.\n' +
            `Status Code: ${statusCode}`);
        } else if (!/^text\/javascript/.test(contentType)) {
            error = new Error('IsitFullMoon API: Invalid content-type.\n' +
            `Expected text/javascript but received ${contentType}`);
        }
        if (error) {
            console.error("Error with full moon GET request: " + error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const moon = JSON.parse(rawData);
                bot.moon = {
                    isFull: null,
                    nextFullMoon: null
                };
                bot.moon.nextFullMoon = new Date(moon.isitfullmoon.next * 1000);
                if (moon.isitfullmoon.status === "Yes")
                    bot.moon.isFull = true;
                else
                    bot.moon.isFull = false;
                console.log("Full moon variable initialized as " + bot.moon.isFull);
            } catch (e) {
                console.error("Error while parsing full moon JSON: " + e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Error with full moon GET response: ${e.message}`);
    });
}

function getQuotes() {
    let options = {
        hostname: 'api.jsonbin.io',
        path: '/b/' + process.env.QUOTES_ID + '/latest',
        headers: {
            'secret-key': process.env.QUOTES_KEY
        }
    };

    https.get(options, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('JSONbin API: Request Failed.\n' +
            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('JSONbin API: Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error("Error with JSONbin GET request: " + error.message);
            // consume response data to free up memory
            res.resume();
            this.quotes_array = null;
            console.log("Quotes initialized!");
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                this.quotes_array = parsedData;
            } catch (e) {
                console.error("Error while parsing stream JSON: " + e.message);
                this.quotes_array = null;
            }
        });
    }).on('error', (e) => {
        console.error(`Error with stream GET response: ${e.message}`);
        this.quotes_array = null;
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
