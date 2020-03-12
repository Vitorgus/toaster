const { Command } = require('discord.js-commando');

module.exports = class teamsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'teams',
            group: 'other',
            memberName: 'teams',
            description: 'returns the number of people in each shioh character\'s team',
            examples: ['jarvis teams']
        });
    }

    run(msg, args) {
       if (msg.guild.id !== process.env.SHILOH_SERVER && msg.guild.id !== process.env.TEST_SERVER) return;

       let roles_array = require('../../roles_array');
       let teams_size = [];

       roles_array.forEach(object => {
           let role = this.client.guilds.get(process.env.SHILOH_SERVER).roles.get(object.id);
           //if (!role || role.deleted) return;
           if (!role) console.log("Coudn't find team with id " + object.id);
           else if (role.deleted) console.log(`Role ${role.name} with id ${object.id} is deleted, skipping`);
           else teams_size.push({ name: role.name, size: role.members.size });
       });

       if (teams_size.length === 0) return msg.say("Something went wrong. No roles found.");

       teams_size.sort((a, b) => a.size > b.size ? -1 : a.size == b.size ? 0 : 1)
       let answer = teams_size.reduce((string, role) => string + role.name + ' - ' + role.size + '\n', 'Number of members in each team:\n\n');
       return msg.say(answer);
    }
};