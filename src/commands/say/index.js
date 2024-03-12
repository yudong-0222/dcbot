import {SlashCommandBuilder,PermissionFlagsBits,EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'

export const command = new SlashCommandBuilder()
.setName('say')
.setDescription('✨ 用機器人來說出你的話')
.setDefaultMemberPermissions(0n)
.addStringOption((option)=> 
  option.setName(`訊息`).setDescription('你想要傳送的訊息').setRequired(true)
)

//私人訊息
const embed1 = new EmbedBuilder()
	.setColor('Random')
	.addFields({ name: '<a:wrong:1085174299628929034>丨本指令為私人指令!', value: ' ' })
	.addFields({ name: '<a:bunbun:991105824170713088> 僅在特殊伺服器上作用', value: ' ', inline: true })
	.setTimestamp()

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  
  if(interaction.guild.id === process.env.GUILDID || interaction.guild.id === process.env.GUILDID2) {
    interaction.deferReply();
    interaction.deleteReply();
    interaction.channel.send({content: interaction.options.getString('訊息')})
  } else {
    return interaction.reply({embeds: [embed1] ,ephemeral: true})
  }
}
