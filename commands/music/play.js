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
  }

  run(msg, args) {
    const { url } = args;

    var final_url = url;

      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel) {
          return msg.reply(`Please be in a voice channel first!`);
      }

    if(!url.startsWith("http://")){
      youtube.search(url, 1, function(error, result) {
          if (error) {
            msg.say("¯\\_(ツ)_/¯");
          }
          else {
            if (!result || !result.items || result.items.length < 1) {
              msg.say("¯\\_(ツ)_/¯");
            } else {
              final_url = "http://www.youtube.com/watch?v=" + result.items[0].id.videoId;
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
            });
            }
          }
        });
    }
    else {
        voiceChannel.join()
            .then(connnection => {
            console.log(final_url);
        const stream = yt(final_url, {filter: 'audioonly'});
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => {
            console.log("dispatcher ended");
        voiceChannel.leave();
    })
        ;
        return msg.say("Now Playing " + final_url + " for " + msg.author);
    })
        ;
    }
  }
};
