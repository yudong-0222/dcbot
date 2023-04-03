import { Discord,Client, Events, GatewayIntentBits, EmbedBuilder, DiscordAPIError } from 'discord.js'
import dotenv from 'dotenv'
import vueInit from '../src/core/vue'
import {loadCommands,loadEvents} from '../src//core/loader'
import { useAppStore } from './store/app'


vueInit()
dotenv.config()

loadCommands()

const client = new Client({ 
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ] });
const appStore = useAppStore()
appStore.client = client
loadEvents()

client.on("messageCreate", (message) => {
    if (message.content.includes("機率")) {
      var qq = ["12%","54%","9%","87%","43%"," 0%","34%","77%","98%","69%","27%","11%","71%","3%","6%","51%","47%","3%",]
      let contne = qq[Math.floor(Math.random() * qq.length)]
      message.channel.send(`${contne}`)
    }
})

client.login(process.env.TOKEN);