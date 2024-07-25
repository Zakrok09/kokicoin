import {SlashCommandBuilder} from "discord.js";

// export the data to be used in the main file
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: { reply: (arg0: string) => any; }) {
        await interaction.reply('Pong!');
    },
};
