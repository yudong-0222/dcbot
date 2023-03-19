import {SlashCommandBuilder, EmbedBuilder, Options} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoShema from '../../Schemas/ecoSchema'


var timeout = [];

// inside a command, event listener, etc.
const embedss = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨請稍等一下!')
	.setDescription('你執行指令的速度太快了!')
	.setTimestamp()

const noMoney = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨你沒有這麼多點數!')
	.setDescription('`/點數餘額` 查看你當前的餘額有多少')
	.setTimestamp()
  

export const command = new SlashCommandBuilder()
.setName('骰子遊戲')
.setDescription('🎲 骰子遊戲: 與機器人比大小')
.addStringOption(option => 
    option.setName('點數')
    .setDescription("你想要花費點數")
    .setRequired(true)
  )

export const action = async (interaction) =>{
  try {
    let Data = await ecoShema.findOne({Guild: interaction.guild.id, User: interaction.user.id})
    let amount = interaction.options.getString(`點數`);

    if (timeout.includes(interaction.user.id)) return await interaction.reply({embeds: [embedss], ephemeral: true})
    if(amount.startsWith('-')) return await interaction.reply({name: `<a:wrong:1085174299628929034>丨`+"`"+`不能輸入負數!`+"`",ephemeral: true})
    if(amount > Data.Wallet && amount > Data.Bank) return await interaction.reply({embeds: [noMoney], ephemeral: true})
    if(amount.toLowerCase() === 'all' || amount.toLowerCase() === "全部")  {
      if(Data.Wallet === 0) return await interaction.reply({embeds: [noMoney], ephemeral: true});
      amount = Data.Wallet;
    }
    const appStore = useAppStore()
    const client = appStore.client;
    const win = Math.floor(Math.random()* amount )*2;
    const num = Math.floor(Math.random() * (6-1)) +1;
    const num2 = Math.floor(Math.random() * (6-1)) +1;
    let end = "";
    if(num > num2) {
      end += `我獲得 ${num2} 點，我輸了😥\n<a:win:1086957903090552923> 你贏了 **${win}** 點`;
      Data.Wallet += win;
      await Data.save();
    } else if(num < num2) {
      end += `我獲得 ${num2} 點，我贏了😁\n<a:lose:1086958360705892522> 你輸了 **${win}** 點`
      Data.Wallet -= win;
      await Data.save();
    } else {
      end += `我獲得 ${num2} 點，我們平手😘\n你獲得了 1 點`
      Data.Wallet += 1;
      await Data.save();
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
  } catch (error) {
    console.log(`/骰子遊戲 有錯誤: ${error}`);
    const errorCode = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
      .setDescription("如果不能排除，請通知給作者!:") 
      .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
      .setTimestamp()  
      return await interaction.editReply({embeds: [errorCode]})
  }
} 