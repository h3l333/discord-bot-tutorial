const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("A very cool first command!"),
	async execute(interaction) {
		await interaction.reply("Pong.");
	},
};
