const { Command } = require('discord.js-commando');

module.exports = class joinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'shiloh',
            memberName: 'join',
            description: 'Command to add you to your favorite character\'s team. For more info, type `jarvis join help`',
            examples: ['jarvis join help', 'jarvis join team shane', 'jarvis join team best girl', 'jarvis join olive garden'],
            args: [{
                key: 'team_name',
                prompt: 'Wich team do you want to be added to?',
                type: 'string',
                parse: arg => arg.toLowerCase()
            }],
        });
    }

    async run(msg, { team_name }) {
        if (!msg.guild || msg.guild.id !== process.env.SHILOH_SERVER_ID) return;

        const teams_array = require('../../objects/roles_array');
        let answer = '';

        if (team_name === 'help') {
            teams_array.forEach(({id, names}) => {
                const team_role = msg.guild.roles.cache.get(id);
                if (!team_role) {
                    console.log(`Coudn't find role for ${names[0]} with id ${id}`);
                    return;
                } else if (team_role.deleted) {
                    console.log(`Role ${team_role.name} is deleted`);
                    return;
                }
                answer += names.slice(0, names.length -1).reduce((string, name) => string + `\`${name}\`` + ', ', team_role.name + ': ') + `\`${names[names.length - 1]}\`` + '\n';
            });
            return msg.reply('to join a team, simply say `jarvis join team <keyword>`, or simply `jarvis join <keyword>`, where `<keyword>` is one of the keywords for the team you wanna join. Here\'s the list of all keywords:\n\n'
                + (answer !== '' ? answer : `Strange... No team found.`));

        } else {

            const add_team = teams_array.find(({ names }) => names.some(name => team_name === name || team_name === 'team ' + name));
            if (!add_team) return msg.reply(`Coudn't find team with name '${team_name}'`);

            const add_team_role = msg.guild.roles.cache.get(add_team.id);
            if (!add_team_role) return msg.reply(`Something went wrong: coudn't find role for '${team_name}'`);

            const remove_team = teams_array.find(({ id }) => msg.member.roles.has(id));
            if (remove_team) {
                if (add_team === remove_team) return msg.reply("You're already in that team, silly!");
                
                const remove_team_role = msg.guild.roles.cache.get(remove_team.id);
                if (!remove_team_role) {
                    console.log(`JOIN ERROR: failed to get team for role ${remove_team.names[0]} with id ${remove_team.id}`);
                    return msg.reply(`Something went wrong: coudn't find the role to remove you from your current team`);
                }
                try{
                    msg.member.removeRole(remove_team_role);
                } catch(e) {
                    console.log(`JOIN ERROR: failed to remove user from role ${remove_team_role.name}. Cause: ${e}`);
                    return msg.reply(`Something went wrong: coudn't remove you from the role ${remove_team_role.name}.`);
                }
                answer += `Removed you from ${remove_team_role.name}. `;
            }
            try {
                await msg.member.addRole(add_team_role);
            } catch(e) {
                console.log(`JOIN ERROR: failed to add user to role ${add_team_role.name}. Cause: ${e}`);
                return msg.reply(`Something went wrong: coudn't add you to the role ${add_team_role.name}.`);
            }

            answer += `Added to ${add_team_role.name}.`;
            return msg.reply(answer);

        }
    }
};
