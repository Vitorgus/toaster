const { Command } = require('discord.js-commando');

module.exports = class stopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: [
                'stfu',
                'stahp',
                'disconnect'
            ],
            group: 'music',
            memberName: 'stop',
            description: 'Disconnects JARVIS from voice connection on the server',
            examples: [';stop'],
            guildOnly: true
        });
    }

    run(msg, args) {
        let music = this.client.music;
        if(!msg.guild.voiceConnection) return msg.say("I'm not connected to a Voice Channel!");
        if (!music.hasOwnProperty(msg.guild.id) || !music[msg.guild.id].playing) return msg.say("No music is playing!");
        music[msg.guild.id].queue = [];
        msg.guild.voiceConnection.dispatcher.end();
        console.log('Disconnected!');
        return msg.say("Disconnected!");
    }
};
