const { Command } = require('discord.js-commando');

const urban = require("urban");

module.exports = class urbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            group: 'search',
            memberName: 'urban',
            description: 'looks up a word on Urban Dictionary',
            examples: ['jarvis urban OMG', 'jarvis urban flynn', 'jarvis urban goodface'],
            args: [{
                key: 'text',
                prompt: 'What do you want to search on Urban Dictionary?',
                type: 'string'
            }]
        });
    }

    run(msg, { text }) {
        //msg.channel.startTyping();
        //msg.channel.stopTyping();
        var targetWord = text == "" ? urban.random() : urban(text);
        targetWord.first(function(json) {
            //msg.channel.stopTyping();
            if (json) {
                var message = "Urban Dictionary: **" +json.word + "**\n\n" + json.definition;
                if (json.example) {
                    message = message + "\n\n__Example__:\n" + json.example;
                }
                msg.channel.send(message);
            }
            else msg.channel.send("No matches found");
        });
    }
};