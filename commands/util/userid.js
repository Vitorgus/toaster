const { Command } = require('discord.js-commando');

module.exports = class useridCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userid',
            group: 'util',
            memberName: 'userid',
            description: 'Returns the unique id of a user. This is useful for permissions.',
            examples: ['jarvis userid @<username>'],
            args: [{
                key: 'user',
                prompt: 'Which user do you want to troll?',
                type: 'user'
            }]
        });
    }

    run(msg, { user }) {
        return msg.channel.send( "The id of " + user.username + " is " + user.id);
    }
};
