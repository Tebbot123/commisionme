import { EmbedBuilder } from 'discord.js'

export class EmbedTemplate extends EmbedBuilder {
    constructor() {
        super()
        this.setTimestamp(Date.now())
        this.setFooter({ text: 'CommisionMe, by designers' })
        this.setColor(0xf3cc8b)
    }
}
