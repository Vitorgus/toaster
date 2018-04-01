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
            examples: ['jarvis stop', 'jarvis stahp', 'jarvis disconnect', 'jarvis stfu'],
            guildOnly: true
        });
    }

    run(msg, args) {
        msg.channel.startTyping();
        //msg.channel.stopTyping();
        let music = this.client.music[msg.guild.id] ;
        setTimeout(() => {
            msg.channel.stopTyping();
            if(!msg.guild.voiceConnection) return msg.say("I'm not connected to a Voice Channel!");
            if (!music || !music.playing) return msg.say("No music is playing!");
            music.queue.splice(0, music.queue.length);
            msg.guild.voiceConnection.dispatcher.end("Stopped!");
            console.log('Disconnected!');
        }, 500);
        
    }
};
