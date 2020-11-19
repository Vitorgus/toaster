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

        const guild_id = msg.guild.id;
        const guild = await this.client.guilds.fetch(guild_id);
        if (!guild.available) return msg.say("Coudn't count team members due to discord serve outage");

        await guild.members.fetch();

        const db = this.client.database;

        try {
            const result = await db.query('SELECT id FROM teams WHERE guild = $1', [guild_id])

            const teams_array = result.rows;
            if (teams_array.length === 0) return msg.say("Sorry, but it seems this server doesn't have any team. Maybe the mods should try adding one with `jarvis add_team`");
            
            const teams_size = [];
        
            teams_array.forEach(({ id }) => {
                let team_role = guild.roles.resolve(id);
                if (!team_role) console.log(`Coudn't find role id ${id}`);
                else if (team_role.deleted) console.log(`Role ${team_role.name} with id ${id} is deleted, skipping`);
                else teams_size.push({ name: team_role.name, size: team_role.members.size });
            });

            if (teams_size.length === 0) return msg.say("Uhh... no role was found. Weird.");

            teams_size.sort((a, b) => {
                const size_comp = b.size - a.size;
                if (size_comp !== 0) return size_comp;
                return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
            })
            let answer = teams_size.reduce((string, role) => string + role.name + ' - ' + role.size + '\n', 'Number of members in each team:\n\n');
            return msg.say(answer);
        } catch(e) {
            msg.reply(`an error occurred: \`${e.message}\``);
        }

    }
};
