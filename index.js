const {
	Client,
	Events,
	GatewayIntentBits,
	MessageFlags,
	Collection,
} = require("discord.js");
require("dotenv").config({ path: "config/.env" });
const path = require("node:path");
const fs = require("node:fs");

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

const commandFoldersPath = path.join(__dirname, "commands"); // Access /commands
const commandFolders = fs.readdirSync(commandFoldersPath); // Read the folders within the directory

for (const folder of commandFolders) {
	// For each folder in the aforementioned directory
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js")); // Read every file in the subdirectory that ends with '.js'
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath); // Import the exported command within the script
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] Command at ${filePath} missing either a data or execute property.`,
			);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventsFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js")); // Read every file within the 'events' directory

for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath); // Import the export of every script within the directory
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// The prior blocks of code dynamically import scripts from the 'events' and 'commands' subdirectories

client.login(token); // Creates persistent WebSocket connection through Discord Gateway
