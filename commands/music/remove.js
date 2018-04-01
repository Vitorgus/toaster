const { Command } = require('discord.js-commando');

module.exports = class removeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            group: 'music',
            memberName: 'remove',
            description: 'Removes the last song the user added to the queue',
            examples: ['jarvis remove'],
            guildOnly: true
        });
    }

    run(msg, args) {
        msg.channel.startTyping();
        //msg.channel.stopTyping();
        let music = this.client.music[msg.guild.id] ;
        setTimeout(() => {
            if(!msg.guild.voiceConnection) return msg.say("I'm not connected to a Voice Channel!");
            if (!music || !music.playing) return msg.say("No music is playing!");
            if (!music.queue.length) return msg.say("There's no music in the queue!");
            for (let i = music.queue.length - 1; i >= 0; i--) {
                if (music.queue[i].user === msg.author.id) {
                    let name = music.queue[i].title;
                    music.queue.splice(i, 1);
                    console.log("Removed song: " + name);
                    msg.channel.stopTyping();
                    return msg.say(`Removed  \`${name}\` from the queue`);
                }
            }
            msg.channel.stopTyping();
            return msg.say("You haven't added any music in the queue!");
        }, 500);
    }
};
