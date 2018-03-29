const { Command } = require('discord.js-commando');

const yt = require('ytdl-core');
var youtube_node = require('youtube-node');
youtube = new youtube_node();
youtube.setKey(process.env.YOUTUBE_KEY);
youtube.addParam('type', 'video');

/*
TODO find out why does jarvis won't play those videos
https://www.youtube.com/watch?v=L-u3fkgZkO0
https://www.youtube.com/watch?v=8GPo-6RQiN0
https://youtu.be/pSwD5vZ04iU
https://youtu.be/65BAeDpwzGY
*/

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
                key: 'url',
                prompt: 'What is the URL/tags of the video you would like to play?',
                type: 'string'
            }]
        });
    }

    async run(msg, { url }) {

        const anchor = this;
        let music = this.client.music; //const?

        function queue(link) {
            yt.getInfo(link, (err, info) => {
                if(err) return msg.say(`Whoops. Something went wrong with the song: \`${err}\``);
                //TODO check somewhere in the code if the links starts with http://, cuz if not, add it in the beginning of it.
                let song = {
                    url: link,
                    title: info.title,
                    user: msg.author.id
                };
                if (!music[msg.guild.id])
                    music[msg.guild.id] = {
                        playing: false,
                        queue: [],
                    }
                if (!music[msg.guild.id].playing) {       //TODO find out why this is undefined
                    music[msg.guild.id].playing = true;
                    return play(song);
                }
                else {
                    music[msg.guild.id].queue.push(song);
                    return msg.say(`Added \`${info.title}\` to the queue for \`${msg.author.username}\``);
                }
            });
        }

        async function play(song) {
            let channel = msg.member.voiceChannel;
            if (!song) {
                msg.guild.voiceConnection.disconnect();//channel.leave();
                music[msg.guild.id].playing = false;
                console.log("Queue is empty!");
                msg.say("Ended!");
                return;
            }
            //TODO check if is not already connected to voiceChannel
            let connection = await channel.join();
            //.then(connection => {
            console.log(song.title + " - " + song.url);
            let stream = yt(song.url, {filter: 'audioonly'});
            let disp = connection.playStream(stream);
            disp.on('end', reason => {
                reason ? console.log(reason) : console.log("Dispatcher ended");
                setTimeout(() => {
                    play(music[msg.guild.id].queue.shift());
                }, 1000);
            });
            return msg.say(`Now playing ${song.url} for <@${song.user}>`);
            //});
        }

        if (!msg.member.voiceChannel) return msg.reply(`Please be in a voice channel first!`);

        //TODO replace the line below with regExp (Note: the link doesn't need http(s):// in front of it)
        if(url.startsWith("http://") || url.startsWith("https://")) return queue(url);

        youtube.search(url, 1, {type: "video"}, function(error, result) {
            if (error)  return msg.say(`Error while searching for the video:  \`${error}\``);

            if (!result || !result.items || result.items.length < 1) {
                console.log("ERROR_PLAY2");
                console.log("Result: " + result);
                console.log("Result items: " + result.items);
                console.log("Result items length " + result.items.length);
                return msg.say(`Something that couldn't go wrong, went wrong. ${anchor.client.owners[0]}, check the logs.`);
            } else {
                let final_url = "http://www.youtube.com/watch?v=" + result.items[0].id.videoId;
                return queue(final_url);
            }
        });
    }
    
};
