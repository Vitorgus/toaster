const { Command } = require('discord.js-commando');
const ytsearch = require("../../common/ytsearch");

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

    async run(msg, { tags }) {
        //msg.channel.startTyping();
        //msg.channel.stopTyping();

        try {
            const id = await ytsearch(tags);
            if (!id) return msg.say(`Sorry ${msg.author}, but I didn't find any video when searching for \`${tags}\``);
            msg.reply(`http://www.youtube.com/watch?v=${id}`);
        } catch (e) {
            msg.reply(`something went wrong. Coudn't complete the search \`${tags}\`: \`${e.message}\``)
            console.log(e);
        }
    }
};
