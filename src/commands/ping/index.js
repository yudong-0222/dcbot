import {SlashCommandBuilder, EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'


export const command = new SlashCommandBuilder()
.setName('延遲')
.setDescription('取得機器人的延遲')

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const wait = require('node:timers/promises').setTimeout;
    const sent = await interaction.reply({ content: '<a:load:1084371236836081674> 正在取得延遲...', fetchReply: true });
    await wait (3000);
    return await interaction.editReply(`<:niceping:1085146221338959943> - 延遲: **${sent.createdTimestamp - interaction.createdTimestamp} ms**`);
  } catch (error) {
   console.log(`/ping 有錯誤`); 
   const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.editReply({embeds: [errorCode]})
  }
}
