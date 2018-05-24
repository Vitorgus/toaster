const { Command } = require('discord.js-commando');

module.exports = class redquoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'redquote',
            aliases: [
                'redrum'
            ],
            group: 'fun',
            memberName: 'redquote',
            description: 'Gives a random RED quote (Shiloh chat only)',
            examples: ['jarvis redquote']
        });
    }

    run(msg, args) {
        //if (msg.guild != process.env.SHILOH_CHAT) return;
        let quotes = this.client.quotes["red"];
        msg.reply(quotes[Math.floor(Math.random() * quotes.length)]);
    }
};
