const { Collection } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class teamsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'teams',
            group: 'shiloh',
            memberName: 'teams',
            description: 'returns the number of people in each shiloh character\'s team',
            examples: ['jarvis teams']
        });
    }

    async run(msg, args) {
       if (msg.guild.id !== process.env.SHILOH_SERVER_ID && msg.guild.id !== process.env.TEST_SERVER_ID) return;

       let teams_array = require('../../objects/roles_array');

       let shiloh_guild = await this.client.guilds.fetch(process.env.SHILOH_SERVER_ID);
       if (!shiloh_guild.available) return msg.say("Coudn't count team members due to discord serve outage");

       await shiloh_guild.members.fetch();

       let teams_size = [];
       
       teams_array.forEach(({id, names}) => {
           let team_role = shiloh_guild.roles.resolve(id);
           if (!team_role) console.log(`Coudn't find role for ${names[0]} with id ${id}`);
           else if (team_role.deleted) console.log(`Role ${team_role.name} with id ${id} is deleted, skipping`);
           else teams_size.push({ name: team_role.name, size: team_role.members.size });
       });

       if (teams_size.length === 0) return msg.say("Something went wrong. No roles found.");

       teams_size.sort((a, b) => b.size - a.size)
       let answer = teams_size.reduce((string, role) => string + role.name + ' - ' + role.size + '\n', 'Number of members in each team:\n\n');
       return msg.say(answer);
    }
};
