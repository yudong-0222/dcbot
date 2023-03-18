import {EmbedBuilder, SlashCommandBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

export const command = new SlashCommandBuilder()
.setName('提領')
.setDescription('從銀行提領點數到錢包當中!')
.addStringOption(option => option.setName('數量').setDescription(`欲提領點數數量`).setRequired(true))

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  
  const { options, user, guild} = interaction;

  const amount = options.getString(`數量`);
  const Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});

  if(!Data) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法執行此操作\n因為你沒有帳戶`, ephemeral: true})
  if(amount.startsWith('-')) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法提領負數點數額`,ephemeral: true},)

  if(amount.toLowerCase === 'all' || amount.toLowerCase === '全部') {
    if(Data.Bank === 0) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你沒有點數能夠做這個!`, ephemeral: true})
    
    Data.Wallet += Data.Bank;
    Data.Bank =0;

    await Data.save();
    
    return await interaction.reply({content: `<a:verify2:1085147601638268968>丨所有點數已提領到錢包中\n查詢點數請使用`+"`"+`/點數餘額`+"`", ephemeral: true})
  } else {
    const Converted = Number(amount);

    if(isNaN(Converted) === true) return await interaction.reply({content: `<a:verify2:1085147601638268968>丨數量只能填入 `+"`"+`數字`+"`"+` 或者 `+"`"+`全部/all`, ephemeral: true})
    
    if(Data.Bank < parseInt(Converted) || Converted === Infinity) return await interaction.reply({content: `<a:verify2:1085147601638268968>丨你的銀行沒有這麼多點數可以提領`, ephemeral: true})

    Data.Wallet += parseInt(Converted);
    Data.Bank -= parseInt(Converted);
    Data.Bank = Math.abs(Data.Bank);

    await Data.save();

    const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('<a:checked:1086296113818128414>丨交易成功')
    .setDescription(`成功將 ${parseInt(Converted)} 點**提領至錢包**`)

    return await interaction.reply({embeds: [embed]})

  }

}
