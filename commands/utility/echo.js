const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("echo")
		.setDescription("Replies with your input.")
		.addStringOption((option) =>
			option
				.setName("input")
				.setDescription("The input to echo back!")
				.setRequired(true),
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Specifies the channel to echo into."),
		)
		.addBooleanOption((option) =>
			option
				.setName("ephemeral")
				.setDescription("Whether or not the echo should be ephemeral."),
		),
	async execute(interaction) {
		const channel = interaction.options.getChannel("channel");
		const message = interaction.options.getString("input");
		const temp = interaction.options.getBoolean("ephemeral");

		if (!message) {
			return interaction.reply({
				content: `You need to provide a message to echo!`,
				flags: temp ? MessageFlags.Ephemeral : undefined,
			});
		}

		if (!channel) {
			return await interaction.reply({
				content: `${message}`,
				flags: temp ? MessageFlags.Ephemeral : undefined,
			});
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral }); // Acknowledges interaction but delays response

		await channel.send({
			content: `${message}`, // channel.send() cannot be ephemeral
		});

		await interaction.editReply({
			content: "Message sent.",
		});
	},
};
