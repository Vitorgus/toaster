const { Command } = require('discord.js-commando');

module.exports = class birdCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bird',
            group: 'fun',
            memberName: 'bird',
            description: 'toggles on/off if the bot should bird every Az message',
            examples: ['jarvis bird activate', 'jarvis bird deactivate', 'jarvis bird on', 'jarvis bird off'],
            args: [{
                key: 'toggle',
                prompt: 'Should I activate or deactivate the bird mode?',
                type: 'string'
            }],
            ownerOnly: true
        });
    }

    run(msg, { toggle }) {
        let discord = require('discord.js');
        if (msg.channel instanceof discord.GroupDMChannel ||
            (msg.channel instanceof discord.TextChannel && msg.guild.id != process.env.SHILOH_SERVER_ID) ||
            (msg.channel instanceof discord.DMChannel && !this.client.isOwner(msg.author))) return;
        if (toggle === "activate" || toggle === "on"){  // If the command is to activate eggplant mode
            this.client.generaldb.set("bird", true);    // Sets true in the database
            console.log("Bird mode activated!");        // Logs it
            return msg.say("Activated 🐦");//🍅");                // Sends a message confirming the activation
        }
        else if (toggle === "deactivate" || toggle === "off"){  // If the command is to deactivate eggplant mode
            let name = this.client.generaldb.get("victim4");     // Gets vicitm name
            /*
            if (msg.author.username == name)
                return msg.say(msg.guild.emojis.find("name", "cliffsmug"));
            */
            this.client.generaldb.set("bird", false);         // Sets the eggplant to false
            console.log("Bird mode deactivated!");            // Logs it
            return msg.say("Deactivated 🐦");//🍅");                    // Sends a message confirming it
        }
        else{                                                                     // If the command wasn't to either activate or deactivate
            let hollis = msg.guild.emojis.find("name", "hollistilt")                // Tries to get hollistils emoji
            if (hollis)                                                             // If it was sucessfull
                msg.say(hollis.toString());                                           // Prints the emoji
            return msg.say("I can only activate or deactivate the bird mode."); // Sends a message
        }
    }
};
