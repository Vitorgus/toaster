import { Command } from 'discord.js-commando';

module.exports = class profilepicCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profilepic',
            group: 'util',
            memberName: 'profilepic',
            description: 'Returns the profile image of the user.',
            examples: ['jarvis profilepic @<username>'],
            args: [{
                key: 'user',
                prompt: 'Which user do you want to get the image of?',
                type: 'user'
            }]
        });
    }

    run(msg, { user }) {
        return msg.channel.send(user.avatarURL());
    }
};
