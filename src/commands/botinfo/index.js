import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js'
import {useAppStore} from '../../store/app'

export const command = new SlashCommandBuilder()
.setName('機器人資訊')
.setDescription('看看這隻機器人的資訊吧!')

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const Ver = "`V0.352`";
    const rank = "`專家II`";
    const author = `<@${interaction.guild.ownerId}>`;
    // const icon = `${client.user.displayAvatarURL()}`

    const row = new ActionRowBuilder() 
    .addComponents(
      new ButtonBuilder()
      .setLabel(`LGD戰隊伺服器`)
      .setStyle(ButtonStyle.Link)
      .setEmoji(`<a:Newbadge:1084372472159285258> `)
      .setURL('https://discord.gg/e7KBPZ4qqX'),

      new ButtonBuilder()
      .setLabel(`邀請機器人`)
      .setStyle(ButtonStyle.Link)
      .setEmoji(`<:Koshka:1084363834883579964> `)
      .setURL('https://dsc.gg/koshka-legend)')
    )

    const BotEmbed = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`<:Koshka:1084363834883579964> ${client.user.username} 的資訊`)
    // .setThumbnail(`${icon}`)
    .addFields({ name: '機器人作者', value: author , inline: true})
    .addFields({ name: '機器人版本', value: Ver , inline: true})
    .addFields({ name: '機器人段位', value: rank , inline: true})
    .setTimestamp()
    .setFooter({ text: '@2023 KOSHKA-LENGEND', iconURL: 'https://i.imgur.com/clEn73Q.gif'});
      
    interaction.reply({ embeds: [BotEmbed], components: [row]});

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