import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export class SlashCommand {
    constructor(
        public CommandData: SlashCommandBuilder,
        public execute: (Interaction: ChatInputCommandInteraction) => void,
    ) {}
}
