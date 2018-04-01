const { Command } = require('discord.js-commando');

var youtube_node = require('youtube-node');
youtube = new youtube_node();
youtube.setKey(process.env.YOUTUBE_KEY);
youtube.addParam('type', 'video');

module.exports = class youtubeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'youtube',
            group: 'search',
            memberName: 'youtube',
            description: 'gets youtube video matching the tags stated by the user',
            examples: ['jarvis youtube mirror haus', 'jarvis youtube adventure of a lifetime'],
            args: [{
                key: 'tags',
                prompt: 'What tags would you like to search for?',
                type: 'string'
            }]
        });
    }

    run(msg, { tags }) {
        msg.channel.startTyping();
        //msg.channel.stopTyping();

        youtube.search(tags, 1, {type: "video"}, function(error, result) {
            if (error)  {
                msg.channel.stopTyping();
                return msg.say(`Error while searching for the video:  \`${error}\``);
            }

            if (!result || !result.items || result.items.length < 1) {
                console.log("ERROR_PLAY2");
                console.log("Result: " + result);
                console.log("Result items: " + result.items);
                console.log("Result items length " + result.items.length);
                msg.channel.stopTyping();
                return msg.say(`Something that couldn't go wrong, went wrong. ${anchor.client.owners[0]}, check the logs.`);
            }
            else {
                msg.channel.stopTyping();
                msg.say("http://www.youtube.com/watch?v=" + result.items[0].id.videoId);
            }
        });

    }
};
