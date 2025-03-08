// CommisionMe
// Written by Tebbot

import {
    ActivityType,
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    MessageFlags,
    PresenceUpdateStatus,
    REST,
    Routes,
} from 'discord.js'
import dotenv from 'dotenv'
import chalk from 'chalk'
import ora from 'ora'
import cliSpinners from 'cli-spinners'
import path from 'node:path'
import fs from 'node:fs'
import { SlashCommand } from 'Classes/Command'

// Setup .env files
dotenv.config({ path: '.env.development.local' })

if (!process.env.DISCORD_TOKEN) {
    console.error('THERE IS NO DISCORD BOT TOKEN!!')
}

// Setup chalk (pretty :3)
chalk.level = 1

const intents = [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
]
const client = new Client({ intents })

// Fancy stuff UwU

console.log(
    chalk.cyan(`
 ▄▄·       • ▌ ▄ ·. • ▌ ▄ ·. ▪  .▄▄ · ▪         ▐ ▄ • ▌ ▄ ·. ▄▄▄ .
▐█ ▌▪▪     ·██ ▐███▪·██ ▐███▪██ ▐█ ▀. ██ ▪     •█▌▐█·██ ▐███▪▀▄.▀·
██ ▄▄ ▄█▀▄ ▐█ ▌▐▌▐█·▐█ ▌▐▌▐█·▐█·▄▀▀▀█▄▐█· ▄█▀▄ ▐█▐▐▌▐█ ▌▐▌▐█·▐▀▀▪▄
▐███▌▐█▌.▐▌██ ██▌▐█▌██ ██▌▐█▌▐█▌▐█▄▪▐█▐█▌▐█▌.▐▌██▐█▌██ ██▌▐█▌▐█▄▄▌
·▀▀▀  ▀█▄▀▪▀▀  █▪▀▀▀▀▀  █▪▀▀▀▀▀▀ ▀▀▀▀ ▀▀▀ ▀█▄▀▪▀▀ █▪▀▀  █▪▀▀▀ ▀▀▀ 
`),
)
console.log(
    chalk.bgMagentaBright.bold('Written by Tebbot \nBuilt for hobbyist\n'),
)

// Command Handler

const commandsCollection = new Collection<string, SlashCommand>() // Collection for commands
const commandsArray = []

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath).default as SlashCommand

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if (command instanceof SlashCommand) {
            commandsCollection.set(command.CommandData.name, command)
            commandsArray.push(command.CommandData)
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
            )
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = commandsCollection.get(
        interaction.commandName,
    ) as SlashCommand
    if (!command) {
        console.error(`No command matching ${interaction.commandName}...`)
    }

    try {
        command.execute(interaction)
    } catch (e) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            })
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            })
        }
    }
})

const token: string = process.env.DISCORD_TOKEN as string
const rest = new REST().setToken(token)

;(async () => {
    try {
        if (process.env.RUN_MODE == 'development') {
            const data = await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID as string,
                    process.env.GUILD_ID as string,
                ),
                { body: commandsArray },
            )
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID as string),
                {
                    body: commandsArray,
                },
            )
        }
    } catch (e) {
        console.error(e)
    }
})()

console.log(chalk.greenBright('Loaded CommisionMe!'))

const spinner = ora({
    text: chalk.yellow('Starting CommissionMe'),
    spinner: cliSpinners.hearts,
    color: 'cyan',
}).start()

client.once(Events.ClientReady, (readyClient) => {
    spinner.stop()
    console.log(
        chalk.cyan(
            `${readyClient.user.username} is online and ready to recive commands!`,
        ),
    )

    readyClient.user.setPresence({
        activities: [
            {
                name: 'Killing my Self',
                state: 'Watch me swallow bleach',
                type: ActivityType.Streaming,
            },
        ],
    })
})

client.login(token) // Bot Login
