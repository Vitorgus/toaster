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
    if (toggle === "activate"){                     // If the command is to activate eggplant mode
      this.client.generaldb.set("eggplant", true);  // Sets true in the database
      console.log("Eggplant mode activated!");      // Logs it
      return msg.say("Activated 🍆");                // Sends a message confirming the activation
    }
    else if (toggle === "deactivate"){
      if (msg.author.username == "Zorg"){                   // If Zorg is trying to deactivate the eggplant
        let cliff = msg.guild.emojis.find("name", "cliffsmug"); // Tries to get the :cliffsmug emoji:
        if (cliff)                                          // If the emoji exists
          return msg.say(cliff.toString());                 // Responds with smugness in emoji form
        else                                                //If there's no such emoji
          return msg.say("Nope!");                          // Responds with smugness in text form
      } 
      this.client.generaldb.set("eggplant", false); // It it wasn't Zorg who is trying to deactivate
      console.log("Eggplant mode deactivated!");    // Logs it
      return msg.say("Deactivated 🍆");              // Sends a message confirming it
    }
    else{
      let hollis = msg.guild.emojis.find("name", "hollistilt")
      if (hollis)
        msg.say(hollis.toString());
      return msg.say("I can only activate or deactivate the eggplant mode.");
    }
  }
};
