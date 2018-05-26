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

    async run(msg, { user }) {
        user = user.toLowerCase();
        let quotes_array = this.client.quotes_array;
        if (user === "status") {
            let text = `\nNumber of quoted users: ${quotes_array.length}\n`;
            quotes_array.forEach(person => {
                text += `\t- ${person['name']}: ${person['quotes'].length} quotes\n`;
            });
            return msg.reply(text);
        }
        let person = quotes_array.find(obj => {
            return obj['name'] === user;
        });
        if (person)
            return msg.reply(person['quotes'][Math.floor(Math.random() * person['quotes'].length)]);
        /*for (let i in quotes_array) {
            let person = quotes_array[i];
            if (person['name'] == user) 
                return msg.reply(person['quotes'][Math.floor(Math.random() * person['quotes'].length)]);
        }*/
        return msg.reply(`sorry but I have no quotes on \`${user}\`. Have you typoed their name?`);
    }
};
