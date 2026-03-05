const { Events, Collection, MessageFlags } = require("discord.js");
const { cooldown } = require("../commands/utility/ping");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.log(
				`No command by the name of ${interaction.commandName} was found.`,
			);
			return;
		}

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		} // If there are no cooldowns logged for a command, create a new collection as the property value

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name); // Get the timestamps for the called command
		const defaultCooldownDuration = 3;
		const cooldownAmount =
			(command.cooldown ?? defaultCooldownDuration) * 1_000;

		if (timestamps.has(interaction.user.id)) {
			// If the user has already used the command
			const expirationTime =
				timestamps.get(interaction.user.id) + cooldownAmount;
			if (now < expirationTime) {
				const remainingSeconds = Math.ceil(
					(expirationTime - Date.now()) / 1000,
				); // If the expiration time has not yet elapsed, warn the user
				return interaction.reply({
					content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again in \`${remainingSeconds}\` seconds.`,
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		} catch (e) {
			console.error(e);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error executing the command.",
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: "There was an error executing the command.",
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};
