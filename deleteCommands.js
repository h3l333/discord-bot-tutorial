const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

const rest = new REST().setToken(token);

rest
	.delete(Routes.applicationGuildCommand(clientId, guildId, "commandId"))
	.then(() => console.log("Guild command deleted."))
	.catch(console.error);

rest
	.delete(Routes.applicationCommand(clientId, "commandId"))
	.then(() => console.log("Application command deleted."))
	.catch(console.error);
