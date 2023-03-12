import {SlashCommandBuilder,EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'

export const command = new SlashCommandBuilder()
.setName('使用者資訊')
.setDescription('取得使用者的資訊(當前僅能查看自己)')
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

  const embed = new EmbedBuilder()
  .setColor("#ee1233")
  .setAuthor({name: tag, iconURL: icon})
  .setThumbnail(icon)
  .addFields({name: 'Member', value: `${user}`, inline: false})
  .addFields({name: '加入伺服器的時間', value: `<t:${parseInt(member.joinedAt /1000)}:R>`, inline: true})
  .addFields({name: '加入Discord的時間', value: `<t:${parseInt(user.createdAt /1000)}:R>`, inline: true})
  .setFooter({text: `使用者 ID: ${user.id}`})
  .setTimestamp()
 
  await interaction.reply({embeds: [embed]});
}