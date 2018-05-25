const { Command } = require('discord.js-commando');

module.exports = class redquoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'fun',
            memberName: 'quote',
            description: 'Gives a random quote from the specified user',
            examples: ['jarvis quote red', 'jarvis quote steam', 'jarvis quote zorg'],
            args: [{
                key: 'text',
                prompt: 'From who do you want a quote from?',
                type: 'string'
            }]
        });
    }

    run(msg, { user }) {
        let quotes = this.client.quotes;
        if (!quotes[user]) return msg.reply(`sorry, but I have no quotes on ${user}. Have you typoed their name?`);
        return msg.reply(quotes[user][Math.floor(Math.random() * quotes[user].length)]);
    }
};
