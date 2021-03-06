import { Command } from 'discord.js-commando';

module.exports = class rollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'other',
            memberName: 'roll',
            description: 'roll one die with x amount ofsides, or multiple dice using d20 syntax. Default value is 10',
            examples: ['jarvis roll 6', 'jarvis roll 4', 'jarvis roll 20'],
            args: [{
                key: 'num',
                prompt: 'How many sides on the die?',
                type: 'integer'
            }]
        });
    }

    run(msg, { num }) {
    	// Verificar número menor que 1 e número em notação decimal
        var result = Math.floor((Math.random() * num)) + 1;
        return msg.say(`${msg.author} rolled a ${result}`);
}
};
