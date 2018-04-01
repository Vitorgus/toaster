const { Command } = require('discord.js-commando');

module.exports = class myidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'myid',
            group: 'other',
            memberName: 'myid',
            description: 'returns the user id of the sender',
            examples: ['jarvis myid']
        });
    }

    run(msg, args) {
        msg.channel.startTyping();
        //msg.channel.stopTyping();
        setTimeout(() => {
            msg.channel.stopTyping();
            return msg.say(msg.author.id);
        }, 500);
    }
};
