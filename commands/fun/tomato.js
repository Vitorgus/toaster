const { Command } = require('discord.js-commando');

module.exports = class tomatoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'apple',
            group: 'fun',
            memberName: 'apple',
            description: 'toggles on/off if the bot should apple every Red message',
            examples: ['jarvis apple activate', 'jarvis apple deactivate', 'jarvis apple on', 'jarvis apple off'],
            args: [{
                key: 'toggle',
                prompt: 'Should I activate or deactivate the apple mode?',
                type: 'string'
            }],
            ownerOnly: true
        });
    }

    run(msg, { toggle }) {
        if (msg.channel instanceof Discord.GroupDMChannel ||
            (msg.channel instanceof Discord.TextChannel && msg.guild.id != process.env.SHILOH_CHAT) ||
            (msg.channel instanceof Discord.DMChannel && !this.client.isOwner(msg.author))) return;
        if (toggle === "activate" || toggle === "on"){  // If the command is to activate eggplant mode
            this.client.generaldb.set("apple", true);  // Sets true in the database
            console.log("Apple mode activated!");      // Logs it
            return msg.say("Activated 🍎");//🍅");                // Sends a message confirming the activation
        }
        else if (toggle === "deactivate" || toggle === "off"){  // If the command is to deactivate eggplant mode
            let name = this.client.generaldb.get("victim2");     // Gets vicitm name
            if (msg.author.username == name)
                return msg.say(msg.guild.emojis.find("name", "cliffsmug"));
            this.client.generaldb.set("apple", false);         // Sets the eggplant to false
            console.log("Apple mode deactivated!");            // Logs it
            return msg.say("Deactivated 🍎");//🍅");                    // Sends a message confirming it
        }
        else{                                                                     // If the command wasn't to either activate or deactivate
            let hollis = msg.guild.emojis.find("name", "hollistilt")                // Tries to get hollistils emoji
            if (hollis)                                                             // If it was sucessfull
                msg.say(hollis.toString());                                           // Prints the emoji
            return msg.say("I can only activate or deactivate the apple mode."); // Sends a message
        }
    }
};
