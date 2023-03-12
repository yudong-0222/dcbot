import {SlashCommandBuilder, EmbedBuilder, TextChannel} from 'discord.js'
import {useAppStore} from '../../store/app'

export const command = new SlashCommandBuilder()
.setName('骰子遊戲')
.setDescription('🎲 骰子遊戲: 與機器人比大小')

export const action = async (interaction) =>{
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
      .setColor(0x18e1ee)    
    
      await interaction.reply({embeds: [embed]})
      
    const DiceE = new EmbedBuilder()
      .setColor("#eeefff")
      .setTitle(`🎲你獲得了 ${num} 點`)
      .setDescription(end)
    
    interaction.editReply({embeds: [DiceE]})

} 