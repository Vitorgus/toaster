import { Command } from 'discord.js-commando';

import urban from "urban";

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
        var targetWord = text == "" ? urban.random() : urban(text);
        try {
            targetWord.first(function(json) {
                if (json) {
                    var message = "Urban Dictionary: **" +json.word + "**\n\n" + json.definition;
                    if (json.example) {
                        message = message + "\n\n__Example__:\n" + json.example;
                    }
                    return msg.channel.send(message);
                }
                else return msg.channel.send("No matches found");
            });
        } catch (e) {
            console.log(e);
            return msg.reply(`something went wrong. Coudn't complete the search \`${text}\`: \`${e.message}\``)
        }
    }
};
