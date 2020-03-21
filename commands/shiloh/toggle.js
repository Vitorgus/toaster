const { Command } = require('discord.js-commando');

module.exports = class toggleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'toggle',
            group: 'shiloh',
            memberName: 'toggle',
            description: 'Toggles on/off jarvis\' reaction to someone\'s message',
            examples: ['jarvis bird activate', 'jarvis bird deactivate', 'jarvis bird on', 'jarvis bird off'],
            args: [{
                key: 'reaction_name',
                prompt: 'What reaction should I toggle on/off?',
                type: 'string'
            }],
            ownerOnly: true,
            hidden: true
        });
    }

    run(msg, { reaction_name }) {
        let discord = require('discord.js');
        if (msg.channel instanceof discord.GroupDMChannel ||
            (msg.channel instanceof discord.TextChannel && msg.guild.id != process.env.SHILOH_SERVER_ID && msg.guild.id != process.env.TEST_SERVER_ID) ||
            (msg.channel instanceof discord.DMChannel && !this.client.isOwner(msg.author))) return;

        const reactions_array = require('../../objects/reactions_array');
        const reaction = reactions_array.find(({ name }) => reaction_name === name);
        if (!reaction) return msg.say(`Coudn't find reaction with name ${reaction_name}`);

        // This logic works, but it's a little slow. Test it on the message event in index.js.
        if (!this.client.testMap.has(reaction.name)) {
            const func = message => {
                if (message.author.id === reaction.victim) {
                    message.react(reaction.emoji);
                }
            }
            this.client.testMap.set(reaction.name, func);
            this.client.on('message', func);
            return  msg.say("Activated " + reaction.emoji);
        } else {
            const func = this.client.testMap.get(reaction.name);
            this.client.removeListener('message', func);
            this.client.testMap.delete(reaction.name);
            return msg.say("Deactivated " + reaction.emoji);
        }
    }
};
