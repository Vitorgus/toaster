import { Command } from 'discord.js-commando';

module.exports = class announceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            group: 'other',
            memberName: 'announce',
            description: 'bot says message with text to speech',
            examples: ['jarvis announce like a boss', 'jarvis announce new page in the comic is out!'],
            args: [{
                key: 'text',
                prompt: 'What do you want JARVIS to announce?',
                type: 'string'
            }]
        });
    }

    run(msg, { text }) {
        return msg.say(text,{tts:true});
    }
};
