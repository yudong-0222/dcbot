import {SlashCommandBuilder,EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'
import workSchema from '../../Schemas/workSchema'


export const command = new SlashCommandBuilder()
.setName('使用者資訊')
.setDescription('取得使用者的資訊')
.addUserOption(
  option=>
    option
    .setName('使用者')
    .setDescription('愈查詢的使用者')
    .setRequired(false))

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()

  const user = interaction.options.getUser('使用者') || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);
  const icon = user.displayAvatarURL();
  const tag = user.tag;
  
  const Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id})
  let  total = 0;
  const Working = await workSchema.findOne({Guild: interaction.guild.id, User: user.id})
  let workname;

  if(!Working || !Working.Work){
    workname = "待業中"
  } else {
    workname = Working.Work;
  }
  
  if(!Data) {
     total = "他沒有帳戶";
  } else {
    total = Math.round(Data.Wallet + Data.Bank);
  }

  const embed = new EmbedBuilder()
  .setColor('Random')
  .setAuthor({name: tag, iconURL: icon})
  .setThumbnail(icon)
  .setDescription(`<:information:1086592637546532905> 以下是 ** <@${user.id}> **的資訊`)
  .addFields({name: '使用者 <:user:1085144531399356518>', value: `${user}`, inline: true})
  .addFields({name: '加入本群時間 <:time:1085145666445135924>', value: `<t:${parseInt(member.joinedAt /1000)}:R>`, inline: true})
  .addFields({name: '帳號創建時間 ⏱️', value: `<t:${parseInt(user.createdAt /1000)}:R>`, inline: true})
  .addFields({name: `使用者ID <:idcard:1085144829308186685>`, value: "`"+`${user.id}`+"`", inline: true})
  .addFields({name: `社會信用點數 <a:purpleCard:1086599525726175292>`, value: !Data ? "`"+`${total}`+"`" : "`"+`${total}`+"` 點" , inline: true})
  .addFields({name: `打工狀態 <:jobs:1088446692262674492>`, value: `\`${workname}\`` , inline: true})
  .setTimestamp()

  await interaction.reply({embeds: [embed]});
  } catch (error) {
    const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.reply({embeds: [errorCode]})
  }
  
}