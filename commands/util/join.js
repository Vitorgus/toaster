const { Command } = require('discord.js-commando');

module.exports = class joinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'util',
            memberName: 'join',
            description: 'toggles on/off if the bot should egg every Mill message',
            examples: ['jarvis egg activate', 'jarvis egg deactivate', 'jarvis egg on', 'jarvis egg off'],
            args: [{
                key: 'team_name',
                prompt: 'Wich team do you want to be added to?',
                type: 'string',
                parse: arg => arg.toLowerCase()
            }],
        });
    }

    async run(msg, { team_name }) {
        if (!msg.guild || msg.guild.id !== process.env.SHILOH_SERVER) return;
        
        console.log("Trying to find team with name = '" + team_name + "'");
        const team_array = require('../../roles_array');
        let answer = '';

        const add_role_object = team_array.find(({ names }) => names.some(name => name === team_name));
        if (!add_role_object) return msg.reply(`Coudn't find team with name '${team_name}'`);

        const add_role = msg.guild.roles.get(add_role_object.id);
        if (!add_role) return msg.reply(`Something went wrong: coudn't find role for '${team_name}'`);

        const remove_role_object = team_array.find(({ id }) => msg.member.roles.has(id));
        if (remove_role_object) {
            if (add_role_object === remove_role_object) return msg.reply("You're already in that team, silly!");
            
            const remove_role = msg.guild.roles.get(remove_role_object.id);
            if (!remove_role) return msg.reply(`Something went wrong: coudn't find the role toremove you from your current team`);
            
            try{
                msg.member.removeRole(remove_role);
            } catch(e) {
                return msg.reply(`Something went wrong: coudn't remove you to the role ${remove_role.name}. Cause: ${e}`);
            }
            answer += `Removed you from ${remove_role.name}. `;
            console.log(`Removed user from role ${remove_role.name}`);
        }
        try {
            await msg.member.addRole(add_role);
        } catch(e) {
            return msg.reply(`Something went wrong: coudn't add you to the role ${add_role.name}. Cause: ${e}`);
        }

        console.log(`Added user to role ${add_role.name}`);
        answer += `Adedd to ${add_role.name}.`;
        return msg.reply(answer);
    }
};
