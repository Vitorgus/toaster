const { Command } = require('discord.js-commando');

module.exports = class joinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'util',
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

        const team_array = require('../../roles_array');
        let answer = '';

        if (team_name === 'help') {

            console.log('Displaying help from join command');

            team_array.forEach(({id, names}) => {
                const role = msg.guild.roles.get(id);
                if (!role) {
                    console.log(`Coudn't find role for ${names[0]} with id ${id}`);
                    return;
                } else if (role.deleted) {
                    console.log(`Role ${role.name} is deleted`);
                }
                answer += names.slice(0, names.length -1).reduce((string, name) => string + `\`${name}\`` + ', ', role.name + ': ') + `\`${names[names.length - 1]}\`` + '\n';
            });
            return msg.reply('to join a team, simply say `jarvis join team <keyword>`, or simply `jarvis join <keyword>`, where `<keyword>` is one of the keywords for the team you wanna join. Here\'s the list of all keywords:\n\n'
                + (answer !== '' ? answer : `Strange... No team found.`));

        } else {

            console.log("Trying to find team with name = '" + team_name + "'");

            const add_role_object = team_array.find(({ names }) => names.some(name => team_name === name || team_name === 'team ' + name));
            if (!add_role_object) return msg.reply(`Coudn't find team with name '${team_name}'`);

            const add_role = msg.guild.roles.get(add_role_object.id);
            if (!add_role) return msg.reply(`Something went wrong: coudn't find role for '${team_name}'`);

            const remove_role_object = team_array.find(({ id }) => msg.member.roles.has(id));
            if (remove_role_object) {
                if (add_role_object === remove_role_object) return msg.reply("You're already in that team, silly!");
                
                const remove_role = msg.guild.roles.get(remove_role_object.id);
                if (!remove_role) return msg.reply(`Something went wrong: coudn't find the role to remove you from your current team`);
                
                try{
                    msg.member.removeRole(remove_role);
                } catch(e) {
                    return msg.reply(`Something went wrong: coudn't remove you to the role ${remove_role.name}. Cause: ${e}`);
                }
                answer += `Removed you from ${remove_role.name}. `;
                console.log(`Removed ${msg.author.username} from role ${remove_role.name}`);
            }
            try {
                await msg.member.addRole(add_role);
            } catch(e) {
                return msg.reply(`Something went wrong: coudn't add you to the role ${add_role.name}. Cause: ${e}`);
            }

            console.log(`Added ${msg.author.username} to role ${add_role.name}`);
            answer += `Added to ${add_role.name}.`;
            return msg.reply(answer);

        }
    }
};
