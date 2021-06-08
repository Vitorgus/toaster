import { Command } from 'discord.js-commando';

module.exports = class sayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: [
                'copycat',
                'repeat',
                'echo',
                'parrot'
            ],
            group: 'other',
            memberName: 'say',
            description: 'bot says message that the sender tells it to',
            examples: ['jarvis say hi', 'jarvis say Im sexy', 'jarvis say You are the best!'],
            args: [{
                key: 'text',
                prompt: 'What do you want JARVIS to say?',
                type: 'string'
            }]
        });
    }

    run(msg, { text }) {
        console.log("Saying: " + text);
        return msg.say(text);
    }
};
