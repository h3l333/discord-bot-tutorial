const { Client, Events, GatewayIntentBits, MessageFlags, Collection } = require('discord.js');
require('dotenv').config({ path: 'config/.env' });
const path = require('node:path');
const fs = require('node:fs');

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders)
{
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles)
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else
        {
            console.log(`Command at ${filePath} missing either a data or execute property.`)
        }
    }
}

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready. Logged in as ${readyClient.user.tag}.`);
});

client.login(token);

client.on(Events.InterationCreate, async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command)
    {
        console.log(`No command matching ${interaction.commandName} was found`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (e)
    {
        console.log(e);
        if(interaction.replied || interaction.deferred)
        {
            await interaction.followUp({
                content: 'There was an error executing the command',
                flags: MessageFlags.Ephemeral,
            })
        } else {
            await interaction.reply({
                content: 'There was an error executing the command',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});

const rest = new REST().setToken(token);