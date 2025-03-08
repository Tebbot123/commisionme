import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export class SlashCommand {
    constructor(
        private CommandData: SlashCommandBuilder,
        private execute: (Interaction: ChatInputCommandInteraction) => void,
    ) {}
}
