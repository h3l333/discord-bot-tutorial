const { REST, Routes } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config({ path: "config/.env" });

// The client receives events through a WebSocket gateway, but operations that affect the
// bot's configuration require HTTP-based communications. So does sending messages and responding to
// user interactions.

const commands = [];

const commandFoldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
} // Dynamically read command handler scripts, extract and load their command definitions

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const rest = new REST(); // Creates REST client instance capable of making HTTP requests
// Not a persistent connection. Each REST call is a seperate HTTP request
rest.setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} slash commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{
				body: commands,
			},
		); // Construct the API endpoint path and send a PUT HTTP request
		console.log("Successfully reloaded commands.");
	} catch (e) {
		console.error(e);
	}
})(); // Immediately invoked function expression
