import {SlashCommandBuilder,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'
import workSchema from '../../Schemas/workSchema'


export const command = new SlashCommandBuilder()
.setName('帳戶')
.setDescription('經濟系統-帳戶')


export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
  const client = appStore.client;
  
  const {user, guild} = interaction;


  const embed = new EmbedBuilder()
  .setColor('#333555')
  .setTitle('社會信用點數帳號')
  .setDescription('選項如下，點擊按鈕來確認')
  .addFields({name: '創建帳戶', value: `創建一個帳戶 \n(已創建則不會再另外創建一個)`})
  .addFields({name: '刪除帳戶', value: `刪除現有的帳戶 \n(<:warn:1085138987636752414>**請注意:所有金額都會消失**)`})

  const embed2 = new EmbedBuilder()
  .setColor('#333555')
  .setTitle('<a:verify2:1085147601638268968> 帳戶創建完畢!')
  .setDescription('帳戶已經創建完畢。\n使用 `/點數餘額`查看當前的餘額')
  .addFields({name: '成功!', value: `帳號已經創建完畢!`})
  .setFooter({text: `來自 ${interaction.user.username}`})
  .setTimestamp()

  const embed3 = new EmbedBuilder()
  .setColor('#333555')
  .setTitle('<a:verify2:1085147601638268968> 帳戶已經刪除完畢')
  .setDescription('使用 `/創建帳戶`重新建立?')
  .addFields({name: '成功', value: `你的帳號已經成功刪除`})

  const button = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId('page1')
    .setEmoji(`<:success:1085139200992624710>`)
    .setLabel('創建帳戶')
    .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
    .setCustomId('page2')
    .setEmoji(`<:warn:1085138987636752414>`)
    .setLabel(`刪除帳戶`)
    .setStyle(ButtonStyle.Danger)
  )

  const message = await interaction.reply({ embeds: [embed], components: [button]})
  const collector = await message.createMessageComponentCollector();
  let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});
  let total;
  let workla = await workSchema.findOne({Guild: interaction.guild.id, User: user.id});

  collector.on(`collect`, async i =>{
    try {
      if (i.customId === 'page1') {
        if(i.user.id != interaction.user.id) {
          return i.reply({content:`<:X_:1076798408494436403> | 只有 ${interaction.user.tag} 能夠使用這個!`, ephemeral: true})
        }
        if(Data) {
          total = Data.Bank + Data.Wallet
          if(total < 0) {
            return i.reply({content: `<a:wrong:1085174299628929034>丨您目前處於欠債狀態，無法重新建立帳戶\n你必須把債還清才有權限做到這個!`, ephemeral: true})
          } 
          
          return i.reply({content: `<a:wrong:1085174299628929034>丨你已經擁有帳戶了`, ephemeral: true});
        }
        
        const oneDayMs = 24 * 60 * 60 * 1000
        Data = new ecoSchema({
          Guild: interaction.guild.id,
          User: user.id,
          Bank: 0,
          Wallet: 1000,
          lastDaily: new Date(Date.now() - oneDayMs),
          isWorking: false,
        })
        await Data.save();
        await i.update({embeds: [embed2], components: [] })
      }
      if (i.customId === 'page2') {
        ;
        if(i.user.id != interaction.user.id) {
          return i.reply({content:`<:X_:1076798408494436403> | 只有 ${interaction.user.tag} 能夠使用這個!`, ephemeral: true})
        }
        
        if(!Data) {
          return i.reply({content: `<a:wrong:1085174299628929034>丨你無法執行此操作\n因為你沒有帳戶`, ephemeral: true});
        } else {
          total = Data.Bank + Data.Wallet
          if(total < 0) return i.reply({content: `<a:wrong:1085174299628929034>丨你無法執行此指令，因為您仍然負債。\n把債還完才有權限刪除帳戶!`, ephemeral: true});
        }
        await workSchema.deleteMany();
        await ecoSchema.deleteMany();
        await i.update({embeds: [embed3], components: [] })
      }
    } catch (error) {
      console.log(`/帳戶 有錯誤: ${error}`)
      const errorCode = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
      .setDescription("如果不能排除，請通知給作者!:") 
      .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
      .setTimestamp()  
      return await i.reply({embeds: [errorCode]})
    }
  })
  } catch (error) {
    console.log(`/帳戶 有錯誤: ${error}`);
    const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.reply({embeds: [errorCode]})
  }
  
}