# Project Overview

**.vscode/settings.json:** Handles configurations for VSCode ensuring consistency across all team developers' IDEs.

**commands/utility:** Defines commands and their associated functions.

- **/ping.js:** Upon being called, responds with "Pong.".
- **/server.js:** Provides basic server information.
- **/user.js:** Provides basic information about the user that executed the command.
- **/reload.js:** Implements runtime command reloading, removing cached command modules and loading their updated source code into the running bot, without entirely restarting it.

**config:**

- **/.env:** Environment variables.
- **/eslint.config.js:** Code formatting configuration. Ensures consistent styles and
  detection of bad patterns within node.js projects.

**events:** Includes scripts that handle Discord events, like a user joining/leaving, a message being sent, a slash command being executed, etc.

- **/interactionCreate.js:** Script that handles the event that fires when a user interacts with the client, such as when they run a slash command or click a button.
- **/ready.js:** Logs that the bot is ready and ready to receive events and messages.

**node_modules:** Modules that the project depends on to run.

**deploy-commands.js:** Script that registers and updates commands. Dynamically reads commands from the 'commands' folder which contains scripts handling command logic, such as setting names, definitions and functions to run upon being called.

---

# Commands

**reload.js:** Imports Events object and SlashCommandBuilder class. The “Events” object maps out key value pairs to string literals, while the SlashCommandBuilder() constructor constructs a new instance of the SlashCommandBuilder class, a data structure that describes a slash command for Discord’s API to then register upon executing “deploy-commands.js”.

Defines an object to export that contains the data and execute properties: data contains the SlashCommandBuilder object with its associated properties, namely name, description and “string option” (optional parameters passed in by the user upon command execution); execute, on the other hand, defines the function to be executed upon the command being called.

execute(interaction): execute() is defined by the user within the export itself, it receives an interaction object, converted from a JSON payload. “interactionCreate” refers to a value found within the Events object originally imported; an interaction is “created” by discord.js upon the client receiving an event in which a user called a slash command.

interaction.options.getString(“command”).toLowerCase(); takes from the options object, wrapped within the passed-in interaction, the value associated with a “command” key and converts it to lower case.

interaction.client.commands.get(commandName) retrieves from the client object the commands, represented by a Map, and searches within it the command specified by the user upon the command being called. If one isn’t found, the user receives a reply stating that no such command was found and the export’s function returns.

If a command was found, the cached module associated with that command’s file is deleted: node.js keeps a require cache _per running process_. By calling delete (JS operator that removes a property from an object) require.cache[absolutePath] (absolutePath corresponds to a property key) we are removing the command handler’s associated path from cache in order to “reset” the command (only one module entry).

Then, we try to reload the command by requiring the updated file, adding it to the client’s commands and notifying the user on Discord’s end.

---

# Events

**interactionCreate.js:** If it’s not a chat input command or the command doesn’t yet exist, the associated execute function returns. Otherwise, it gets the cooldowns property from the client object nested within the interaction object. The cooldowns property maps out command names to _values_, these values are maps in and of themselves that associate user IDs to last-used timestamps.

If the cooldowns property doesn't have a property itself associated to the called command, it creates it and passes as a value a new collection. The Collection class extends JS’ native Map class and adds extra utility methods to it like filter() and find().

?? returns its right-side operand when the left-hand operand is NULL.

If the expiration time has NOT already elapsed (it is “larger” than the current time), reply to the user with a message warning them that they are on cooldown and need to wait.
