import {SlashCommandBuilder,EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'


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
  const appStore = useAppStore()

  const user = interaction.options.getUser('使用者') || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);
  const icon = user.displayAvatarURL();
  const tag = user.tag;
  const Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id})
  let  total = 0;
  

  if(!Data) {
     total = "他沒有帳戶";
  } else {
    total = Data.Wallet + Data.Bank;
  }


  const embed = new EmbedBuilder()
  .setColor('Random')
  .setAuthor({name: tag, iconURL: icon})
  .setThumbnail(icon)
  .setDescription(`<:information:1086592637546532905> 以下是 ** ${tag} **的資訊`)
  .addFields({name: '使用者 <:user:1085144531399356518>', value: `${user}`, inline: true})
  .addFields({name: '加入本群時間 <:time:1085145666445135924>', value: `<t:${parseInt(member.joinedAt /1000)}:R>`, inline: true})
  .addFields({name: '帳號創建時間 ⏱️', value: `<t:${parseInt(user.createdAt /1000)}:R>`, inline: true})
  .addFields({name: `使用者ID <:idcard:1085144829308186685>`, value: "`"+`${user.id}`+"`", inline: true})
  .addFields({name: `社會信用點數 <a:purpleCard:1086599525726175292>`, value: "`"+`${total}`+"` 點", inline: true})
  .setTimestamp()
 
  await interaction.reply({embeds: [embed]});
}