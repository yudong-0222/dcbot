import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import dotenv from 'dotenv'
import vueInit from '@/core/vue'
import {loadCommands,loadEvents} from '@/core/loader'
import { useAppStore } from '@/store/app'


vueInit()
dotenv.config()

loadCommands()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const appStore = useAppStore()
appStore.client = client

loadEvents()

//這裡是判斷機器人的
client.on(Events.InteractionCreate, async interaction =>{
  if(interaction.customId === 'a'){
    let choices = "";

    await interaction.values.forEach(async value =>{
      choices += `${value}`;
    })
    switch(choices) {
      case "1": 
      const ping = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle('延遲 📶')
      .setDescription('這是一個能讓你看到機器人與伺服器的延遲')
      .addFields(
        { name: '**使用方法**', value: '`/延遲`' },
      )
      .setTimestamp()
      .setFooter({ text: '延遲 - 指令幫助' });

      interaction.reply({embeds: [ping], ephemeral: true});
        break;
      case "3":
        const info = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle('伺服器資訊 📄')
      .setDescription('透過此指令，簡單了解一下此伺服器!')
      .addFields(
        { name: '**使用方法**', value: '`/伺服器資訊`' },
        { name: '效果:', value: '```(伺服器的一些資訊)```' },
      )
      .setTimestamp()
      .setFooter({ text: '伺服器資訊 📄 - 指令幫助' });

      interaction.reply({embeds: [info], ephemeral: true});
        break;
      case "4":
        const bot_info = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle('機器人資訊 🤖')
        .setDescription('透過此指令，簡單了解一下機器人!')
        .addFields(
          { name: '**使用方法**', value: '`/機器人資訊`' },
          { name: '效果:', value: '```(你會看到關於我的一些資訊 😍)```' },
        )
        .setTimestamp()
        .setFooter({ text: '機器人資訊 🤖 - 指令幫助' });
  
        interaction.reply({embeds: [bot_info], ephemeral: true});
        break;
      case "5":
        const user_info = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle('使用者資訊 🙍‍♂️')
        .setDescription('透過此指令，查看某個使用者的資訊吧')
        .addFields(
          { name: '**使用方法**', value: '`/使用者資訊 [使用者]`' },
          { name: '效果:', value: '```關於某使用者的一些資訊、頭像```' },
        )
        .setTimestamp()
        .setFooter({ text: '使用者資訊 🙍‍♂️ - 指令幫助' });
  
        interaction.reply({embeds: [user_info], ephemeral: true});
        break;
      case "6":
        const dice_game = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle('骰子遊戲-比大小 🎲')
        .setDescription('一個小遊戲，你可以和機器人比點數大小')
        .addFields(
          { name: '**使用方法**', value: '`/骰子遊戲`' },
          { name: '效果:', value: '```你跟機器人會得到各自的點數。\n接下來，比大小。未來可能可以賺取Social Credits?!```' },
        )
        .setTimestamp()
        .setFooter({ text: '骰子遊戲 🎲 - 指令幫助' });
  
        interaction.reply({embeds: [dice_game], ephemeral: true});
        break;
      case "7":
        const help_cmd = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle('幫助指令 - 💩')
        .setDescription('一個簡單的使用教學，你現在正在使用。')
        .addFields(
          { name: '**使用方法**', value: '`/幫助`' },
          { name: '效果:', value: '```就現在這樣```' },
        )
        .setTimestamp()
        .setFooter({ text: '幫助指令 - 💩 - 指令幫助' });
        interaction.reply({embeds: [help_cmd], ephemeral: true});
        break;      
      default:
        const wait = require('node:timers/promises').setTimeout;
        await interaction.reply({content: "正在搜尋...🔍", ephemeral: true})
        await wait(3000);
        await interaction.followUp({content: "搜尋失敗 ❌\n請重新確認是否有此指令\n或者是**此指令已被移除**", ephemeral: true})
        break;
    }
  }
})


client.login(process.env.TOKEN);