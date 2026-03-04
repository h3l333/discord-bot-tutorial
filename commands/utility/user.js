const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Describes the user that executed the command."),
	async execute(interaction) {
		await interaction.reply(
			`The command was executed by the user ${interaction.user.username} who joined the server on ${interaction.member.joinedAt}.`,
		);
	},
};
