const { Command } = require('discord.js-commando');
const qs = require("querystring");
const axios = require("axios");

module.exports = class gifCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gif',
            group: 'fun',
            memberName: 'gif',
            description: 'returns a random gif matching the tags passed',
            examples: ['jarvis gif kitten', 'jarvis gif puppies'],
            args: [{
              key: 'tags',
              prompt: 'What tags would you like to use for the gif?',
              type: 'string'
            }]
        });
    }

    async run(msg, { tags }) {
        //msg.channel.startTyping();
        const params = {
            api_key: process.env.TOKEN_GIPHY_API,
            rating: "pg-13",
            tag: tags
        };
        const query = 'http://api.giphy.com/v1/gifs/random?' + qs.stringify(params);
        console.log(query);
        try {
            const answer = await axios.get(query);
            msg.say(answer.data.data.url + " [Tags: " + (tags ? tags : "Random GIF") + "]");
        } catch (e) {
            msg.say(`Coudn't get a gif with the tags \`${tags}\` for some reason. Weird.`);
            console.log(e);
        }
    }
};
