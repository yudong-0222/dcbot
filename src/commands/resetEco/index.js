import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

export const command = new SlashCommandBuilder()
.setName('reseteco')
.setDescription(' 重置伺服器上所有的點數')
.setDMPermission(false)
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;

    const embed2 = new EmbedBuilder()
    .setColor('Green')
    .setTitle('<a:coin1:1087317662998208602> | 已全數重置!')

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<:warn:1085138987636752414> | 確定要重置嗎?')
    .setDescription(`請注意! 此動作將無法撤銷`)

    const embed3 = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:checked:1086296113818128414> | 已經取消重置')
    .setDescription(`你取消了重置這個動作!`)

    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('確認重置')
      .setStyle(ButtonStyle.Success))
      
    .addComponents(
      new ButtonBuilder()
      .setCustomId('no')
      .setLabel('取消重置')
      .setStyle(ButtonStyle.Danger))
      

      const mes = await interaction.reply({embeds: [embed], components: [row]})
      const collector = mes.createMessageComponentCollector({time: 30000});
      collector.on('collect', async i => {
        if(i.customId === 'yes') {
          if(i.member.id != interaction.user.id) {
            return i.reply({content: `<a:Animatederror:1086903258993406003>丨你不是使用指令的人`, ephemeral: true})
          }
          await ecoSchema.updateMany({},{Bank: 0, Wallet: 0});
          return await interaction.editReply({embeds: [embed2], components: []})
        } else {
          if(i.member.id != interaction.user.id) {
            return i.reply({content: `<a:Animatederror:1086903258993406003>丨你不是使用指令的人`, ephemeral: true})
          }
          return await interaction.editReply({embeds:[embed3], components: []})
        }
     


    })
  } catch (error) {
   console.log(`/resetEco 有錯誤`); 
   const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.reply({embeds: [errorCode], components:[]})
  }
}
