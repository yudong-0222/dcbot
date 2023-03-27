import {SlashCommandBuilder, EmbedBuilder} from 'discord.js'
import { initCustomFormatter } from 'vue'
import {useAppStore} from '../../store/app'


export const command = new SlashCommandBuilder()
.setName('stock')
.setDescription('經濟系統-股票指令📈')

export const action = async (interaction) =>{
  try {
    const wait = require('node:timers/promises').setTimeout;
    const appStore = useAppStore()
    const client = appStore.client;
    const e = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:wrong:1085174299628929034>丨股票系統尚未啟用')
    .setFooter({text: `來自 ${interaction.user.username} 的請求`})
    .setTimestamp()

    interaction.reply({ content: '<a:load:1084371236836081674> 正在取得股票資訊...'});
    await wait(5000);
    // await interaction.followUp({embeds: [e], ephemeral: true});
    interaction.editReply({embeds: [e], ephemeral: true, content: ` `,});
    } catch (error) {
      console.log(`/股票 有錯誤: ${error}`);
      const stockError = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:wrong:1085174299628929034>丨股票系統發生錯誤')
      .setDescription("```"+`${error}`+"```")
      .addFields({name: `說明`, value: `你發現了一個錯誤\n請等待修復`})
      .setFooter({text: `來自 ${interaction.user.username} 的請求`})
      .setTimestamp()

      await interaction.followUp({embeds: [stockError], ephemeral: true})
  }
  
}
