import { Discord,Client, Events, GatewayIntentBits, EmbedBuilder, DiscordAPIError } from 'discord.js'
import dotenv from 'dotenv'
import vueInit from '../src/core/vue'
import {loadCommands,loadEvents} from '../src//core/loader'
import { useAppStore } from './store/app'


vueInit()
dotenv.config()

loadCommands()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const appStore = useAppStore()
appStore.client = client

loadEvents()

client.login(process.env.TOKEN);