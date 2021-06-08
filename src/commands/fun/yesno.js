const { Command } = require('discord.js-commando');
const axios = require('axios');

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

    async run(msg, args) {
        //msg.channel.startTyping();
        try {
            const answer = await axios.get('https://yesno.wtf/api');
            msg.say(answer.data.image);
        } catch (e) {
            msg.say("Whoops, coudn't find a yes or no gif, so... maybe?");
            console.log(e);
        }
    }
};
