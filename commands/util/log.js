const { Command } = require('discord.js-commando');

module.exports = class logCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'log',
            group: 'util',
            memberName: 'log',
            description: 'logs message to bot console',
            examples: ['jarvis log everthing is working!', 'jarvis log EUREKA!'],
            args: [{
                key: 'text',
                prompt: 'What do you want to log to the console?',
                type: 'string'
            }],
            ownerOnly: true
        });
    }

    run(msg, { text }) {
        console.log(text);
    }
};
