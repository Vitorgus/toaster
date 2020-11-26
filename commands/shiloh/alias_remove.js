const { Permissions } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class aliasRemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'alias_remove',
            group: 'shiloh',
            memberName: 'alias_remove',
            description: 'removes an existing alias from a team',
            examples: ['jarvis alias_remove alias', 'jarvis alias_remove super cool alias'],
            args: [
                {
                    key: 'alias',
                    prompt: 'What\'s the alias you want to remove?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, { alias }) {
        const db = this.client.database;

        const guild = msg.guild.id;

        if (!this.client.isOwner(msg.author) || !msg.member.permissions.has(Permissions.MANAGE_ROLES)) {
            return msg.reply(`sorry, but you don't have permission to do this.`);
        }

        try {
            // TODO show what team the alias was removed from?

            // TODO deny removal if there's only one alias left?

            const result = await db.query('DELETE FROM team_alias WHERE alias = $1 AND team IN (SELECT id FROM teams WHERE guild = $2)', [alias, msg.guild.id]);
            if (result.rowCount == 0) {
                msg.reply(`sorry but there seems to be no team with alias \`${alias}\` in this guild.`)
            } else {
                msg.say(`Alias \`${alias}\` successfully removed!`);
            }
        } catch (e) {
            console.error(e);
            msg.reply(`sorry but I coudn't remove alias \`${alias}\`. An error ocurred.`);
        }
        
    }
};
