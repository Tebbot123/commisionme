import { SlashCommand } from 'Classes/Command'
import { EmbedTemplate } from 'Classes/Embed'
import { SlashCommandBuilder } from 'discord.js'

const commandData = new SlashCommandBuilder()
    .setName('about')
    .setDescription('Returns information about the bot')

const command = new SlashCommand(commandData, async (interaction) => {
    const embed = new EmbedTemplate()
        .setAuthor({
            name: 'About me!',
        })
        .setDescription(
            'CommisionMe was written by Tebbot, with the intention to make managing graphic commisions easier.\n\n Made open source to allow modifications to the CommisionMe',
        )

    interaction.reply({
        embeds: [embed],
    })
})

export default command
