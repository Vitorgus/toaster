const { Command } = require('discord.js-commando');

module.exports = class userimageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userimage',
            group: 'util',
            memberName: 'userimage',
            description: 'Returns the profile image of the user.',
            examples: ['jarvis userimage @<username>'],
            args: [{
                key: 'user',
                prompt: 'Which user do you want to get the image of?',
                type: 'user'
            }]
        });
    }

    run(msg, { user }) {
        return msg.channel.send(user.avatarURL);
    }
};
