const {
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Select a member and ban them.")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("The member to ban.")
				.setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const target = interaction.options.getUser("target");
		const reason =
			interaction.options.getString("reason") ?? "No reason provided.";

		await interaction.reply(
			`Banning specified user for the following reason: ${reason}`,
		);
		await interaction.guild.members.ban(target);
	},
};
