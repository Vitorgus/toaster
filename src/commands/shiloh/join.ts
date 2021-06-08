import { Command } from 'discord.js-commando';
import CustomClient from '../../custom_client';

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
                prompt: 'Wich team do you want to be added to? Or type `help` for a list.',
                type: 'string',
                parse: arg => arg.toLowerCase()
            }],
        });
    }

    async run(msg, { team_name }) {

        const db = (this.client as CustomClient).database;

        let answer = '';

        if (team_name === 'help') {
            try {
                const info = 'to join a team, simply say `jarvis join team <keyword>`, or simply `jarvis join <keyword>`, where `<keyword>` is one of the keywords for the team you wanna join. Here\'s the list of all keywords:\n\n';

                // TODO a team with no alias don't show here. Left join? Right join?
                const result = await db.query(
                    "SELECT id, name, array_agg(alias) as aliases FROM teams JOIN team_alias ON id = team WHERE guild = $1 GROUP BY id",
                    [msg.guild.id]
                );
                if (result.rows.length === 0) {
                    answer = 'Strange... No team found. Try adding one with `jarvis teams_add`.';
                }

                result.rows.forEach(({id, name, aliases}) => {
                    const team_role = msg.guild.roles.resolve(id);
                    if (!team_role) {
                        console.log(`Coudn't find role for ${name} with id ${id}`);
                        return;
                    } else if (team_role.deleted) {
                        console.log(`Role ${team_role.name} is deleted`);
                        // TODO delete role from database?
                        return;
                    }
                    answer += `${team_role.name}: ` + aliases.map(alias => `\`${alias}\``).join(", ") + '\n';
                });

                return msg.reply(info + answer);
            } catch (e) {
                msg.reply("sorry, but something went wrong. I coudn't list all teams.");
                console.error(e);
            }

        } else {

            const name = team_name.startsWith('team ') ? team_name.replace('team ', '') : team_name;

            // TODO code too complex. Plan code better. For now this will do.
            try {
                const result_add = await db.query("SELECT id from teams JOIN team_alias ON id = team WHERE alias LIKE $1 AND guild = $2", [name, msg.guild.id]);
                if (result_add.rows.length === 0) return msg.reply(`Coudn't find team with name '${name}'`);

                const add_team = result_add.rows[0];

                const add_team_role = msg.guild.roles.resolve(add_team.id);
                if (!add_team_role) return msg.reply(`Something went wrong: coudn't find role for '${name}'`);

                const current_teams = msg.member.roles.cache.map(role => role.id);
                const result_remove = await db.query("SELECT id, name FROM teams WHERE id = ANY ($1) AND guild = $2", [current_teams, msg.guild.id]);

                let remove_teams = result_remove.rows;

                if (remove_teams.length !== 0) {

                    if (remove_teams.some(team => team.id === add_team.id)) {
                        answer += "You're already in that team, silly!";

                        remove_teams = remove_teams.filter(team => team.id !== add_team.id);
                        if (remove_teams.length !== 0) {
                            answer += " But you seem to be in more than one team. Let me fix that for you.\n\n";
                            remove_teams.forEach(team => {
                                const remove_team_role = msg.guild.roles.resolve(team.id);
                                if (!remove_team_role) {
                                    console.log(`JOIN ERROR: failed to get team for role ${team.name} with id ${team.id}`);
                                    answer += `Coudn't find team \`${team.name}\` to remove you from. `;
                                }
                                try{
                                    msg.member.roles.remove(remove_team_role);
                                    answer += `Removed you from ${remove_team_role.name}. `;
                                } catch(e) {
                                    console.log(`JOIN ERROR: failed to remove user from role ${remove_team_role.name}. Cause: ${e}`);
                                    answer += `Coudn't remove you from the role ${remove_team_role.name}. `;
                                }
                            });
                            return msg.reply(answer);
                        }
                    }

                    remove_teams.forEach(team => {
                        const remove_team_role = msg.guild.roles.resolve(team.id);
                        if (!remove_team_role) {
                            console.log(`JOIN ERROR: failed to get team for role ${team.name} with id ${team.id}`);
                            answer += `Coudn't find team \`${team.name}\` to remove you from. `;
                        }
                        try{
                            msg.member.roles.remove(remove_team_role);
                            answer += `Removed you from ${remove_team_role.name}. `;
                        } catch(e) {
                            console.log(`JOIN ERROR: failed to remove user from role ${remove_team_role.name}. Cause: ${e}`);
                            answer += `Coudn't remove you from the role ${remove_team_role.name}. `;
                        }
                    });

                }

                try {
                    await msg.member.roles.add(add_team_role);
                    answer += `Added to ${add_team_role.name}.`;
                } catch(e) {
                    console.log(`JOIN ERROR: failed to add user to role ${add_team_role.name}. Cause: ${e}`);
                    answer += `Coudn't add you to the role ${add_team_role.name}.`;
                }

                return msg.reply(answer);

            } catch (e) {
                console.log(e);
            }

        }
    }
};
