const { Command } = require('discord.js-commando');

module.exports = class wikiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wiki',
      group: 'search',
      memberName: 'wiki',
      description: 'returns the summary of the first matching search result from Wikipedia',
      examples: [';wiki donald trump'],
      args: [{
        key: 'text',
        prompt: 'What do you want to search on Wikipedia?',
        type: 'string'
      }]
    });
  }

  run(msg, args) {
    const { text } = args;

    var query = text;
    var Wiki = require("wikijs").default;

    Wiki().search(query, 1).then( data => {
        Wiki().page(data.results[0]).then(page => {
            page.summary().then(summary => {
                var sumText = summary.toString().split('\n');
                var continuation = function() {
                    var paragraph = sumText.shift();
                    if(paragraph){
                        return msg.channel.send(paragraph,continuation);
                    }
                };
                continuation();
            });
        });
    });
  }
};
