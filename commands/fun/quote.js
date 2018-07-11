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
        let discord = require('discord.js');
        if (msg.channel instanceof discord.GroupDMChannel ||
            (msg.channel instanceof discord.TextChannel && msg.guild.id != process.env.SHILOH_CHAT) ||
            (msg.channel instanceof discord.DMChannel && !this.client.isOwner(msg.author))) return;
        user = user.toLowerCase();
        let quotes_array = this.client.quotes_array;
        if (user === "status") {
            let total_quotes = 0;
            quotes_array.forEach(person => {
                total_quotes += person['quotes'].length;
            });
            let text = `\nNumber of total quotes: ${total_quotes}\n`;
            text += `Number of quoted users: ${quotes_array.length}\n`;
            quotes_array.forEach(person => {
                text += `\t- ${person['name'][0]}: ${person['quotes'].length} quotes\n`;
            });
            return msg.reply(text);
        }
        if (user === "random") {
            let random = Math.floor(Math.random() * quotes_array.length);
            let person = quotes_array[random];
            return msg.reply(person['quotes'][Math.floor(Math.random() * person['quotes'].length)]);
        }
        let person = quotes_array.find(obj => {
            return obj['name'].includes(user);
        });
        if (person)
            return msg.reply(person['quotes'][Math.floor(Math.random() * person['quotes'].length)]);
        return msg.reply(`sorry but I have no quotes on \`${user}\`. Have you typoed their name?`);
    }
};
