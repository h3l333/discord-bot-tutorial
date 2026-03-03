const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('server').setDescription('Describes the server that the command was executed in.'),
    async execute(interaction) {
        await interaction.reply(`This server is ${interaction.guild.name} who joined the server on ${interaction.guild.memberCount}.`);
    }
};