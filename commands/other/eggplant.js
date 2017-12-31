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
    if (toggle === "activate" || toggle === "on"){  // If the command is to activate eggplant mode
      this.client.generaldb.set("eggplant", true);  // Sets true in the database
      console.log("Eggplant mode activated!");      // Logs it
      return msg.say("Activated 🍆");                // Sends a message confirming the activation
    }
    else if (toggle === "deactivate" || toggle === "off"){      // If the command is to deactivate eggplant mode
      let name = this.client.generaldb.get("vicitm");           // Gets vicitm name
      if (msg.author.username == name){                         // If the vicitm is trying to deactivate the eggplant
        let cliff = msg.guild.emojis.find("name", "cliffsmug"); // Tries to get the :cliffsmug emoji:
        if (cliff)                                              // If the emoji exists
          return msg.say(cliff.toString());                     // Responds with smugness in emoji form
        else                                                    //If there's no such emoji
        return msg.say("Nope!");                                // Responds with smugness in text form
      }
      else {                                          // If it wasn't the victim who is trying to deactivate
        this.client.generaldb.set("eggplant", false); // Sets the eggplant to false
        console.log("Eggplant mode deactivated!");    // Logs it
        return msg.say("Deactivated 🍆");              // Sends a message confirming it
      }
    }
    else{                                                                     // If the command wasn't to either activate or deactivate
      let hollis = msg.guild.emojis.find("name", "hollistilt")                // Tries to get hollistils emoji
      if (hollis)                                                             // If it was sucessfull
        msg.say(hollis.toString());                                           // Prints the emoji
      return msg.say("I can only activate or deactivate the eggplant mode."); // Sends a message
    }
  }
};
