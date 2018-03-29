const { Command } = require('discord.js-commando');

module.exports = class skipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: [
                'next'
            ],
            group: 'music',
            memberName: 'skip',
            description: 'Skips the current song',
            examples: ['jarvis skip', 'jarvis next'],
            guildOnly: true
        });
    }

    run(msg, args) {
        let music = this.client.music[msg.guild.id];
        if(!msg.guild.voiceConnection) return msg.say("I'm not connected to a Voice Channel!");
        if (!music || !music.playing) return msg.say("No music is playing!");
        msg.guild.voiceConnection.dispatcher.end("Skipped!");
        //console.log('Skipped!');
    }
};
