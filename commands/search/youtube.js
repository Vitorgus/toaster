const { Command } = require('discord.js-commando');
const axios = require('axios');
const qs = require("querystring");

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

        const params = {
            part: 'id',
            maxResults: 1,
            q: tags,
            type: 'video',
            key: process.env.TOKEN_YOUTUBE_API,
            fields: 'items(id(videoId))'
        };

        const query = 'https://youtube.googleapis.com/youtube/v3/search?' + qs.stringify(params);

        try {
            const answer = await axios.get(query);
            const search = answer.data.items;
            if (!search) return msg.reply(`sorry, but I didn't find any video when searching for \`${tags}\``);
            msg.reply(`http://www.youtube.com/watch?v=${search[0].id.videoId}`);
        } catch (e) {
            msg.reply(`something went wrong. Coudn't complete the search \`${tags}\` because: \`${e.message}\``)
            console.log(e);
        }
    }
};
