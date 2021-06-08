import { Command } from 'discord.js-commando';
import axios from 'axios';

module.exports = class yesnoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'yesno',
            group: 'fun',
            memberName: 'yesno',
            description: 'the bot responds yes or no.',
            examples: ['jarvis yesno', 'jarvsi yesno are you a good bot?', 'jarvis yesno are you sentient?']
        });
    }

    async run(msg) {
        try {
            const answer = await axios.get('https://yesno.wtf/api');
            return msg.say(answer.data.image);
        } catch (e) {
            console.log(e);
            return msg.say("Whoops, coudn't find a yes or no gif, so... maybe?");
        }
    }
};
