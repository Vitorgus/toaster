const { Permissions } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class aliasRemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'teams_remove',
            group: 'shiloh',
            memberName: 'teams_remove',
            description: 'removes an existing team from a team',
            examples: ['jarvis teams_remove 1234567890123456789', 'jarvis teams_remove @Le_super_duper_team'],
            args: [
                {
                    key: 'team',
                    prompt: 'Wich team do you want to remove? It can be the team\'s id, or you can @ the role!',
                    type: 'role'
                }
            ]
        });
    }

    async run(msg, { team }) {
        const db = this.client.database;

        const guild = msg.guild.id;

        if (!this.client.isOwner(msg.author) || !msg.member.permissions.has(Permissions.MANAGE_ROLES)) {
            return msg.reply(`sorry, but you don't have permission to do this.`);
        }

        try {
            const result = await db.query('DELETE FROM teams WHERE id = $1 AND guild = $2', [team.id, msg.guild.id]);
            if (result.rowCount == 0) {
                msg.reply(`sorry but I couldn't find a team \`${alias.name}\` to remove. Maybe it hasn't even been added in the first place?`);
            } else {
                msg.say(`Team \`${team.name}\` successfully removed!`);
            }
        } catch (e) {
            console.error(e);
            msg.reply(`sorry but I coudn't remove team \`${team.name}\`. An error ocurred.`);
        }
        
    }
};
