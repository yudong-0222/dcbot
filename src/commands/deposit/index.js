import {EmbedBuilder, SlashCommandBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

export const command = new SlashCommandBuilder()
.setName('存入')
.setDescription('將點數存入銀行保管')
.addStringOption(option => option.setName('數量').setDescription(`愈存放之點數數量`).setRequired(true))

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
  const client = appStore.client;
  
  const { options, user, guild} = interaction;

  const amount = options.getString(`數量`);
  const Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});

  if(!Data) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法執行此操作\n因為你沒有帳戶`, ephemeral: true})
  if(amount.startsWith('-')) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法存入負數點數額`,ephemeral: true})

  if(amount.toLowerCase() === "all" || amount.toLowerCase() === "全部") {
    if(Data.Wallet === 0) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你沒有點數能夠做這個!`})
    
    Data.Bank += Data.Wallet;
    Data.Wallet =0;

    await Data.save();
    
    return await interaction.reply({content: `<a:verify2:1085147601638268968>丨所有點數已存入銀行`, ephemeral: true})
  } else {
    const Converted = Number(amount);

    if(isNaN(Converted) === true) return await interaction.reply({content: `<a:verify2:1085147601638268968>丨數量只能填入 `+"`"+`數字`+"`"+` 或者 `+"`"+`全部/all`, ephemeral: true})
    
    if(Data.Wallet < parseInt(Converted) || Converted === Infinity) return await interaction.reply({content: `<a:verify2:1085147601638268968>丨你沒有這麼多的點數存放到銀行`, ephemeral: true})

    Data.Bank += parseInt(Converted);
    Data.Wallet -= parseInt(Converted);
    Data.Wallet = Math.abs(Data.Wallet);

    await Data.save();

    const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('<a:checked:1086296113818128414>丨交易成功')
    .setDescription(`成功將 ${parseInt(Converted)} 點**存入銀行**`)

    return await interaction.reply({embeds: [embed], ephemeral: true})

  }
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
