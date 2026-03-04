const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Describes the server that the command was executed in."),
	async execute(interaction) {
		await interaction.reply(
			`The server's name is ${interaction.guild.name} and it has ${interaction.guild.memberCount} members.`,
		);
	},
};
