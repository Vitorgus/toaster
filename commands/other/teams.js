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
       if (msg.guild.id !== process.env.SHILOH_SERVER_ID && msg.guild.id !== process.env.TEST_SERVER_ID) return;

       let teams_array = require('../../roles_array');
       let teams_size = [];

       teams_array.forEach(team => {
           let team_role = this.client.guilds.get(process.env.SHILOH_SERVER_ID).roles.get(team.id);
           //if (!role || role.deleted) return;
           if (!team_role) console.log(`Coudn't find role for ${names[0]} with id ${id}`);
           else if (team_role.deleted) console.log(`Role ${team_role.name} with id ${team.id} is deleted, skipping`);
           else teams_size.push({ name: team_role.name, size: team_role.members.size });
       });

       if (teams_size.length === 0) return msg.say("Something went wrong. No roles found.");

       teams_size.sort((a, b) => a.size > b.size ? -1 : a.size == b.size ? 0 : 1)
       let answer = teams_size.reduce((string, role) => string + role.name + ' - ' + role.size + '\n', 'Number of members in each team:\n\n');
       return msg.say(answer);
    }
};
