const { Command } = require('discord.js-commando');

module.exports = class rollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eggplant',
      aliases: ['zorgplant'],
      group: 'other',
      memberName: 'eggplant',
      description: 'toggles on/off if the bot should eggplant every Zorg message',
      examples: ['jarvis eggplant'],
      guildOnly: true,
      args: [{
        key: 'toggle',
        prompt: 'Should I activate or deactivate the eggplant mode?',
        type: 'string'
      }]
    });
  }

  run(msg, args) {
    const { toggle } = args;
    if (toggle === "activate"){
      this.client.generaldb.set("eggplant", true);
      console.log("Eggplant mode activated!");                            // Logs it
      msg.say("Activated 🍆");                                         // Sends a message confirming the activation
    }
    else if (toggle === "deactivate"){
      if (msg.author.username == "Zorg"){                                         // If Zorg is trying to theactiate the eggplant
        msg.say(msg.guild.emojis.find("name", "cliffsmug").toString());     // Respond with a cliffsmug
        return;                                                                     // Exits the code
      } 
      this.client.generaldb.set("eggplant", false);
      console.log("Eggplant mode deactivated!");                                      // Logs it
      msg.say("Deactivated 🍆");                                                   // Sends a message confirming it
    }
    else{
      hollis = msg.guild.emojis.find("name", "hollistilt")
      msg.say("${hollis} I can only activate or deactivate the eggplant mode.");
    }
  }
};
