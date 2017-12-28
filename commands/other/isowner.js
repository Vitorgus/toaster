const { Command } = require('discord.js-commando');

module.exports = class rollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'isowner',
      group: 'other',
      memberName: 'isowner',
      description: 'verify if the user is the owner of the bot',
      examples: [';isowner'],
    });
  }

  run(msg) {
  	var bool = this.client.isOwner(msg.author);
  	if (bool)
    	return msg.say("Hello, Vitorgus! You are the my owner!");
    else
    	return msg.say("Sorry, but you are not my owner.")
  }
};
