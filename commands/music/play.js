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
            examples: [';play'],
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

        function queue(link) {
            yt.getInfo(link, (err, info) => {
                if(err) return msg.channel.sendMessage(`Whoops. Something went wrong with the song: \`${err}\``);
                let song = {
                    url: link,
                    title: info.title,
                    user: msg.author.id
                };
                if (!anchor.client.music.playing) {       //TODO find out why this is undefined
                    anchor.client.music.playing = true;
                    return play(song);
                }
                return msg.reply("a music is already playing!");
                /*
                this.client.queue.push(song);
                return msg.say(`Added \`${info.title}\` to the queue for \`${msg.author.username}\``);
                */
            });
        }

        function play(song) {
            let channel = msg.member.voiceChannel;
            if (!song) {
                channel.leave();
                anchor.client.music.playing = false;
                console.log("Queue is empty!");
                return;
            }
            channel.join()
            .then(connnection => {
                console.log(song.title + " - " + song.url);
                const stream = yt(song.url, {filter: 'audioonly'});
                const dispatcher = connnection.playStream(stream);
                dispatcher.on('end', () => {
                    play(anchor.client.music.queue.shift(), msg);
                    console.log("dispatcher ended");
                    channel.leave();
                });
                return msg.say(`Now playing ${song.url} for <@${song.user}>`);
            });
        }

        if (!msg.member.voiceChannel) return msg.reply(`Please be in a voice channel first!`);

        if(url.startsWith("http://") || url.startsWith("https://")) return queue(url);

        youtube.search(url, 1, function(error, result) {
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