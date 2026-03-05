const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with a really cool message!"),
	async execute(interaction) {
		await interaction.reply("Pong!");
	},
};
