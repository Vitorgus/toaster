const { Command } = require('discord.js-commando');

const yt = require('ytdl-core');
var youtube_node = require('youtube-node');
youtube = new youtube_node();
youtube.setKey(process.env.YOUTUBE_KEY);
youtube.addParam('type', 'video');

module.exports = class playCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'Plays the given video.',
            examples: [';play'],
            args: [{
            key: 'url',
            prompt: 'What is the URL/tags of the video you would like to play?',
            type: 'string'
            }]
        });
        this.run = this.run.bind(this);
    }

    play(channel, url, msg) {
        channel.join()
        .then(connnection => {
            console.log(url);
            const stream = yt(url, {filter: 'audioonly'});
            const dispatcher = connnection.playStream(stream);
            dispatcher.on('end', () => {
                console.log("dispatcher ended");
                voiceChannel.leave();
            });
            return msg.say("Now Playing " + url + " for " + msg.author);
        });
    }

    run(msg, args) {
        console.log(this);
        const { url } = args;

        var final_url = url;

          const voiceChannel = msg.member.voiceChannel;
          if (!voiceChannel) {
              return msg.reply(`Please be in a voice channel first!`);
          }

        if(!url.startsWith("http://")){
            youtube.search(url, 1, function(error, result) {
            if (error) {
                msg.say("Uhh, something went wrong. <@291235973717688321>, check the logs.");
                console.log("ERROR_PLAY1");
                console.log("Error: " + error);
                console.log("Result: " + result);
            }
            else {
                if (!result || !result.items || result.items.length < 1) {
                    msg.say("Uhh, something went wrong. <@291235973717688321>, check the logs.");
                    console.log("ERROR_PLAY2");
                    console.log("Result: " + result);
                } else {
                    final_url = "http://www.youtube.com/watch?v=" + result.items[0].id.videoId;
                    return this.play(voiceChannel, final_url, msg);
                    /*
                    voiceChannel.join()
                    .then(connnection => {
                        console.log(final_url);
                        const stream = yt(final_url, {filter: 'audioonly'});
                        const dispatcher = connnection.playStream(stream);
                        dispatcher.on('end', () => {
                            console.log("dispatcher ended");
                            voiceChannel.leave();
                        });
                        return msg.say("Now Playing " + final_url + " for " + msg.author);
                    });*/
                }
            }
            });
        }
        else {
            return this.play(voiceChannel, final_url, msg);
            /*
            voiceChannel.join()
            .then(connnection => {
                console.log(final_url);
                const stream = yt(final_url, {filter: 'audioonly'});
                const dispatcher = connnection.playStream(stream);
                dispatcher.on('end', () => {
                    console.log("dispatcher ended");
                    voiceChannel.leave();
                });
                return msg.say("Now Playing " + final_url + " for " + msg.author);
            });*/
        }
    }
};
