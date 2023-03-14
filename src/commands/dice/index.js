import {SlashCommandBuilder, EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'

var timeout = [];


// inside a command, event listener, etc.
const embedss = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨請稍等一下!')
	.setDescription('你執行指令的速度太快了!')
	.setTimestamp()


export const command = new SlashCommandBuilder()
.setName('骰子遊戲')
.setDescription('🎲 骰子遊戲: 與機器人比大小')

export const action = async (interaction) =>{
  if (timeout.includes(interaction.user.id)) return await interaction.reply({embeds: [embedss], ephemeral: true})
  const appStore = useAppStore()
  const client = appStore.client;
  const num = Math.floor(Math.random() * (6-1)) +1;
  const num2 = Math.floor(Math.random() * (6-1)) +1;
  let end = "";
  if(num > num2) {
    end += `我獲得 ${num2} 點，我輸了😥`
  } else if(num < num2) {
    end += `我獲得 ${num2} 點，我贏了😁`
  } else {
    end += `我獲得 ${num2} 點，我們平手😘`
  }

    const embed = new EmbedBuilder()
      .setTitle(`比對中...`)
      .setDescription(`雙方骰子皆已發放.結果即將出爐!`)
      .setColor('Random')    
    
      await interaction.reply({embeds: [embed]})
      
    const DiceE = new EmbedBuilder()
      .setColor("#eeefff")
      .setTitle(`🎲你獲得了 ${num} 點`)
      .setDescription(end)
    
    interaction.editReply({embeds: [DiceE]})
    
    timeout.push(interaction.user.id);
    setTimeout(() => {
      timeout.shift();
    },10000)
} 