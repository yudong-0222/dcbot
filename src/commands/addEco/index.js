import {SlashCommandBuilder, EmbedBuilder,PermissionFlagsBits} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

export const command = new SlashCommandBuilder()
.setName('addeco')
.setDescription(' 增加伺服器上所有人的點數')
.addStringOption(option=>
  option
  .setName('點數')
  .setDescription('增加的點數數量')
  .setRequired(true)
  )
.setDMPermission(false)
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)


export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id});
    let amount = interaction.options.getString('點數')
    
    await ecoSchema.updateMany({},{Bank: amount});

    const embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('<a:checked:1086296113818128414>| 已全數增加點數至銀行!')
    .setDescription(`<a:coin1:1087317662998208602> 增加金額: \`${amount}\``)
    return await interaction.reply({embeds: [embed]})


  } catch (error) {
   console.log(`/addeco 有錯誤`); 
   const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.reply({embeds: [errorCode]})
  }
}
