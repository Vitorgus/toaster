const { Permissions } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class teamsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add_team',
            group: 'shiloh',
            memberName: 'add_team',
            description: 'adds a new team to the join command',
            examples: ['jarvis add_team @Le_super_duper_team', 'jarvis add_team 1234567890123456789'],
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

        if (!this.client.isOwner(msg.author) || !msg.member.permissions.has(Permissions.MANAGE_ROLES)) {
            return msg.reply(`sorry, but you don't have permission to add a role.`);
        }

        // TODO check is the team already exists

        try {
            // TODO transaction so it's all or nothing??
            await db.query('INSERT INTO teams VALUES ($1, $2, $3)', [team.id, team.name, msg.guild.id]);
            await db.query('INSERT INTO team_alias VALUES ($1, $2)', [alias, team.id]);
            msg.say(`\`${team.name}\` successfully added with alias \`${alias}\`!`);
        } catch(e) {
            console.log(e);
            msg.reply(`sorry, but I coudn't add team: \`${e.message}\``);
        }
        
    }
};
