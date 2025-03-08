import { SlashCommand } from 'Classes/Command'
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    type ChatInputApplicationCommandData,
} from 'discord.js'

const commandData = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns server latency')

const command = new SlashCommand(commandData, async (interaction) => {
    await interaction.reply(
        `Pong!🏓 \nAPI Latency is ${Math.round(interaction.client.ws.ping)}ms`,
    )
})

export default command
