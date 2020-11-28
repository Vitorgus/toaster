const { Permissions } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class aliasAddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'alias_add',
            group: 'shiloh',
            memberName: 'alias_add',
            description: 'adds a new alias for a team',
            examples: ['jarvis alias_add @Le_super_duper_team super cool alias', 'jarvis teams_add 1234567890123456789 number one'],
            args: [
                {
                    key: 'team',
                    prompt: 'Wich team do you want to add the alias to? It can be the team\'s id, or you can @ the role!',
                    type: 'role'
                },
                {
                    key: 'alias',
                    prompt: 'What\'s the alias you want to add to this team?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, { team, alias }) {
        const db = this.client.database;

        const guild = msg.guild.id;

        if (!this.client.isOwner(msg.author) && !msg.member.permissions.has(Permissions.MANAGE_ROLES)) {
            return msg.reply(`sorry, but you don't have permission to do this.`);
        }

        try {

            const result_check = await db.query("SELECT id from teams where id = $1", [team.id]);
            if (result_check.rows.length === 0) return msg.reply(`role \`${team.name}\` hasn't been added as a team yet! Use \`jarvis teams_add ${team.id} <alias>\` to add it!`);

            // TODO check if the following can be done in the DB with constrains
            const result_add = await db.query("SELECT id from teams JOIN team_alias ON id = team WHERE alias LIKE $1 AND guild = $2", [alias, msg.guild.id]);
            if (result_add.rows.length !== 0) {
                const existing_team = msg.guild.roles.resolve(result_add.rows[0].id);
                return msg.reply(`alias \`${alias}\` already belongs to team \`${existing_team.name}\``);
            }

            await db.query('INSERT INTO team_alias VALUES ($1, $2)', [alias, team.id]);
            msg.say(`Alias \`${alias}\` successfully added to \`${team.name}\`!`);
        } catch (e) {
            console.error(e);
            msg.reply(`sorry, but I coudn't add alias \`${alias}\` to team \`${team.name}\`: \`${e.message}\``);
        }
        
    }
};
