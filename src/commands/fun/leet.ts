import { Command } from 'discord.js-commando';
import leet from "leet";

module.exports = class leetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leet',
            group: 'fun',
            memberName: 'leet',
            description: 'converts boring regular text to 1337',
            examples: ['jarvis leet jarvis', 'jarvis leet look how cool I am'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to 1337?',
                type: 'string'
            }]
        });
    }

    run(msg, { text }) {
        return msg.say( leet.convert(text));
    }
};
