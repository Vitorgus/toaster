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
                key: 'user',
                prompt: 'From who do you want a quote from? Or type \'status\' to check how many quotes are there.',
                type: 'string'
            }]
        });
    }

    run(msg, { user }) {
        //user = user.toLowerCase();
        let quotes_array = this.client.quotes_array;
        if (user == "status") {
            let text = `Number of quoted users: \`${quotes_array.length}\`\n`;
            quotes.array.forEach(person => {
                text += `\t ${person['name']} : \t${person['quotes'].length} quotes\n`;
            });
            return msg.reply(text);
        }
        quotes.array.forEach(person => {
            if (person['name'] == user) 
                return msg.reply(person['quotes'][Math.floor(Math.random() * person['quotes'].length)]);
        });
        return msg.reply(`sorry but I have no quotes on \`${user}\`. Have you typoed their name?`);
        //if (!quotes[user]) return msg.reply(`sorry but I have no quotes on \`${user}\`. Have you typoed their name?`);
        // return msg.reply(quotes[user][Math.floor(Math.random() * quotes[user].length)]);
    }
};
