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

    run(msg, { url }) {

        function play(song) {
            yt.getInfo(url, (err, info) => {
                if(err) return msg.channel.sendMessage('There was an error with the song. ' + err);
                let channel = msg.member.voiceChannel;
                channel.join()
                .then(connnection => {
                    console.log(info.title + " - " + song);
                    const stream = yt(song, {filter: 'audioonly'}, 1);
                    const dispatcher = connnection.playStream(stream);
                    dispatcher.on('end', () => {
                        console.log("dispatcher ended");
                        channel.leave();
                    });
                    return msg.say("Now Playing " + song + " for " + msg.author);
                });
            });
        }

        if (!msg.member.voiceChannel) return msg.reply(`Please be in a voice channel first!`);

        if(url.startsWith("http://") || url.startsWith("https://")) return play(url);
        
        youtube.search(url, 1, function(error, result) {
            if (error) {
                return msg.say("Error while searching for the video. " + error);
                /*
                console.log("ERROR_PLAY1");
                console.log("Error: " + error);
                console.log("Result: " + result);
                */
            }
            if (!result || !result.items || result.items.length < 1) {
                msg.say("Something that couldn't go wrong, went wrong. <@291235973717688321>, check the logs.");
                console.log("ERROR_PLAY2");
                console.log("Result: " + result);
                console.log("Result items: " + result.items);
                console.log("Result items length " + result.items.length);
            } else {
                let final_url = "http://www.youtube.com/watch?v=" + result.items[0].id.videoId;
                return play(final_url);
            }
        });
    }
};