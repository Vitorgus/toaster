const { Permissions } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class teamsAddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'teams_add',
            group: 'shiloh',
            memberName: 'teams_add',
            description: 'adds a new team to the join command',
            examples: ['jarvis teams_add @Le_super_duper_team le super duper alias', 'jarvis teams_add 1234567890123456789 alias'],
            args: [
                {
                    key: 'team',
                    prompt: 'Wich team do you want to add? It can be the team\'s id, or you can @ the role!',
                    type: 'role'
                },
                {
                    key: 'alias',
                    prompt: 'What\'s the first alias for this team?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, { team, alias }) {
        const db = this.client.database;

        const guild = msg.guild.id;

        if (!this.client.isOwner(msg.author) || !msg.member.permissions.has(Permissions.MANAGE_ROLES)) {
            return msg.reply(`sorry, but you don't have permission to add a role.`);
        }

        try {
            const result = await db.query('SELECT id FROM teams WHERE id = $1', [team.id]);

            if (result.rows.length !== 0) return msg.reply(`\`${team.name}\` has already been added.`);
        } catch (e) {
            console.warn(`Hey, coudn't check if team ${team.name} (id ${team.id}) from guild ${msg.guild.name} (id ${guild}) was already added!`)
            console.warn(e);
        }

        // TODO reuse code for add alias command
        try {
            const result = await db.query(
                'SELECT t.id FROM teams t JOIN team_alias ta ON t.id = ta.team WHERE ta.alias = $1 AND t.guild = $2',
                [alias, guild]
            );

            if (result.rows.length !== 0) {
                const existing_team = msg.guild.roles.resolve(result.rows[0].id);

                return msg.reply(`alias \`${alias}\` already exists for \`${existing_team.name}\`.`);
            }
        } catch (e) {
            console.warn(`Hey, coudn't check if alias ${alias} already existem in guild ${msg.guild.name} (id ${guild})`);
            console.warn(e);
        }
        
        const client = await db.connect();

        try {
            await client.query('BEGIN'); 

            await client.query('INSERT INTO teams VALUES ($1, $2, $3)', [team.id, team.name, guild]);
            await client.query('INSERT INTO team_alias VALUES ($1, $2)', [alias, team.id]);
            await client.query('COMMIT');

            msg.say(`\`${team.name}\` successfully added with alias \`${alias}\`!`);

        } catch (e) {
            await client.query('ROLLBACK');
            console.error(e);
            msg.reply(`sorry, but I coudn't add team: \`${e.message}\``);
        } finally {
            client.release();
        }
        
    }
};
