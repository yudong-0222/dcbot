import {SlashCommandBuilder, EmbedBuilder} from 'discord.js'
import {useAppStore} from '@/store/app'

export const command = new SlashCommandBuilder()
.setName('機器人資訊')
.setDescription('看看這隻機器人的資訊吧!')

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  const Ver = "`V0.31`";
    const rank = "`專家II`";
    const author = `<@${interaction.guild.ownerId}>`;

    const BotEmbed = new EmbedBuilder()
      .setColor("#314564")
      .setTitle(client.user.username)
      .addFields(
        { name: '機器人作者🍿', value: author , inline: true},
        { name: '機器人版本🌭', value: Ver , inline: true},
        { name: '機器人段位😎', value: rank , inline: true},
      )
      .setTimestamp()
      .setFooter({ text: '@2023 KOSHKA-LENGEND', iconURL: 'https://i.imgur.com/clEn73Q.gif'});
    interaction.reply({ embeds: [BotEmbed]});
  

}