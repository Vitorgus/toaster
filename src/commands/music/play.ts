import { Command } from 'discord.js-commando';

import ytdl from 'ytdl-core';
import ytsearch from "../../common/ytsearch";

module.exports = class playCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'Plays the given video.',
            examples: ['jarvis play the sound of silence', 'jarvis play ptx', 'jarvis play http://www.youtube.com/watch?v=jvipPYFebWc'],
            guildOnly: true,
            args: [{
                key: 'request',
                prompt: 'What is the song you would like to play?',
                type: 'string'
            }]
        });
    }

    async run(msg, { request }) {

        if (!msg.member.voice.channel) {
            return msg.reply('you have to be connected in a voice channel first!');
        }

        let song = request;

        if (!song.startsWith('http')) {
            try {
                const id = await ytsearch(song);
                if (!id) return msg.say(`Sorry ${msg.author}, but I didn't find any video when searching for \`${song}\``);
                song = `http://www.youtube.com/watch?v=${id}`;
            } catch (e) {
                msg.reply(`something went wrong. Coudn't complete the search \`${song}\`: \`${e.message}\``)
                console.log(e);
            }
        }

        let connection = null;
        try {
            connection = await msg.member.voice.channel.join();

            // TODO check some config on ytdl for opus stream, or check ytdl-core-discord

            const dispatcher = connection.play(ytdl(song, {filter: 'audioonly'}));
            dispatcher.on('finish', () => {
                msg.say("Music ended!");
                connection.disconnect();
            });

            msg.say(`Now playing ${song} for ${msg.author}`);
        } catch (e) {
            msg.reply(`something went wrong. Coudn't keep playing the song \`${song}\``);
            console.error(e);

            if (connection) {
                connection.disconnect();
            }
        }
    }
    
};
