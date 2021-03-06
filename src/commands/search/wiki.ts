import { Command } from 'discord.js-commando';

module.exports = class wikiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wiki',
            group: 'search',
            memberName: 'wiki',
            description: 'returns the summary of the first matching search result from Wikipedia',
            examples: ['jarvis wiki donald trump', 'jarvis wiki obama', 'jarvis wiki meme war'],
            args: [{
                key: 'text',
                prompt: 'What do you want to search on Wikipedia?',
                type: 'string'
            }]
        });
    }

    run(msg, { text }) {
        //msg.channel.startTyping();
        //msg.channel.stopTyping();

        var query = text;
        var Wiki = require("wikijs").default;

        try {
            Wiki().search(query, 1).then( data => {
                Wiki().page(data.results[0]).then(page => {
                    page.summary().then(summary => {
                        var sumText = summary.toString().split('\n');
                        //msg.channel.stopTyping();
                        var continuation = function() {
                            var paragraph = sumText.shift();
                            if(paragraph){
                                return msg.channel.send(paragraph,continuation);
                            }
                        };
                        continuation();
                    });
                });
            });
        } catch (e) {
            console.log(e);
            return msg.reply(`something went wrong. Coudn't complete the search \`${text}\`: \`${e.message}\``)
        }
    }
};
