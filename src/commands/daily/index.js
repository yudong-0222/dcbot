import {SlashCommandBuilder, EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'


const cannot = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨目前無法領取!')
	.setDescription('你今天已經領取過此獎勵 明天再來!')
	.setTimestamp()

const noAccount = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨獎勵無法領取!')
	.setDescription('因為你沒有帳號!\n> 使用 `/帳戶`\n創建一個帳戶使用這個!')
	.setTimestamp()

const did = new EmbedBuilder()
	.setColor('Green')
	.setTitle('<a:48:1086689450714730506>丨獎勵領取完畢')
	.setDescription('你領取了 **每日獎勵**')
	.setTimestamp()  

const dailyError = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨獎勵無法領取!')
	.setDescription('原因: **帳戶問題**!\n> Error Code: `ACER001`\n*可能是你的帳戶仍然是舊版*\n**(僅能重新建立ㄌQQ)**')
	.setTimestamp()    





export const command = new SlashCommandBuilder()
.setName('每日獎勵')
.setDescription('每日獎勵 💌')
.setDMPermission(false)

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id});
  try {
    await interaction.deferReply();

    if (!Data) {
      return await interaction.editReply({embeds: [noAccount]});
    } else {
      const lastDailyDate = Data.lastDaily.toDateString();
      const currentDate = new Date().toDateString();
      if (lastDailyDate === currentDate) {
        return await interaction.editReply({embeds: [cannot]})
      }
      Data.Wallet += 1000;
      Data.lastDaily = new Date();
      await Data.save();
      interaction.editReply({embeds: [did]})
    }
  } catch (error) {
    console.log(`每日獎勵有-錯誤: ${error}`)
    const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.editReply({embeds: [errorCode]})
  }
}

