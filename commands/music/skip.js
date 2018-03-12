const { Command } = require('discord.js-commando');

module.exports = class stopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: [
                'next'
            ],
            group: 'music',
            memberName: 'skip',
            description: 'Skips the current song',
            examples: [';stop'],
            guildOnly: true
        });
    }

    run(msg, args) {
        let music = this.client.music;
        if(!msg.guild.voiceConnection) return msg.say("I'm not connected to a Voice Channel!");
        if (!!music.hasOwnProperty(msg.guild.id) || !music[msg.guild.id].playing || !music[msg.guild.id].dispatcher) return msg.say("No music is playing!");
        music[msg.guild.id].dispatcher.end();
        console.log('Skipped!');
    }
};