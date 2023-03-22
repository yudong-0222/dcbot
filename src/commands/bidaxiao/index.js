import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

const putwal = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:wrong:1085174299628929034>丨你的錢包沒有錢!')
    .setDescription('請將銀行中的存款提領出來\n使用 `/帳戶`!\n或者去賺取點數QQ')
    .setTimestamp()
    
const noAccount = new EmbedBuilder()
  .setColor('Red')
  .setTitle('<a:wrong:1085174299628929034>丨請先創建一個帳戶!')
  .setDescription('雙方必須要有帳戶才能夠遊玩\n使用 `/帳戶`!')
  .setTimestamp()

  const noMoney = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨其中一位玩家沒有這麼多點數!')
	.setDescription('`/點數餘額` 查看當前的餘額有多少')
  .addFields({name: `解決方法:`, value: "`"+`/點數餘額`+"`"+` 查看餘額\n`+"`"+`/提領`+"`"+` 將點數提領到錢包使用`})
	.setTimestamp()


export const command = new SlashCommandBuilder()
.setName('bib')
.setDescription('經濟系統 - 雙人比大小')
.addUserOption(option =>
  option
  .setName('使用者')
  .setDescription('你要一同遊玩的對象')
  .setRequired(true)
  )
.addStringOption(option =>
  option
  .setName('點數')
  .setDescription('花費的點數')
  .setRequired(true)
  )

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const cost = interaction.options.getString('點數')
    const ememy = interaction.options.getUser('使用者');
    const Converted = Number(cost)

    const {user} = interaction

    let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id});
    let Data2 = await ecoSchema.findOne({Guild: interaction.guild.id, User: ememy.id});
    if(ememy.id === user.id) return await interaction.reply({name: '你不能和自己遊玩', ephemeral: true})
    if(!Data || !Data2) return await interaction.reply({embeds: [noAccount]});
  
    const num1 = Math.round(Math.random()* 100)+1;
    const num2 = Math.round(Math.random()* 100)+1;
    const money = Math.round(Math.random()*cost*1.5) +150;

    if (cost.startsWith('-')) return interaction.reply({content: `<a:wrong:1085174299628929034>丨不能輸入負數!` ,ephemeral: true}) 
    if (cost > Data.Wallet || cost > Data2.Wallet ) return await interaction.reply({embeds: [noMoney], ephemeral: true})

    if(!(cost.toLowerCase() === 'all') && isNaN(Converted) === true)  {
      const wrong = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:wrong:1085174299628929034>丨僅能輸入 `數字` 或者 `all`!')
      .setTimestamp()
      return await interaction.reply({embeds: [wrong], ephemeral: true})
    } else {
      if(Data.Wallet <= 0 || Data2.Wallet <= 0) return await interaction.reply({embeds: [noMoney], ephemeral: true});
    }
    const btn = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('accept')
      .setLabel('同意遊玩')
      .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
      .setCustomId('dd')
      .setLabel('拒絕遊玩')
      .setStyle(ButtonStyle.Danger)
    );

    const eee = new EmbedBuilder()
    .setTitle(`<:diamond:990508369049686066>丨雙人比大小 - 邀請`)
    .setDescription(`<@${user.id}> 邀請 <@${ememy.id}> 參與比大小\n點擊下方的按鈕同意或拒絕`)
    interaction.reply({content:`<@${ememy.id}>`,embeds: [eee], components: [btn]})
    const collector = interaction.channel.createMessageComponentCollector({time: 30000});
    collector.on('collect', async i => {
      if(i.member.id === interaction.user.id) {
        return i.reply({content: `<a:Animatederror:1086903258993406003>丨你不是被邀請者`, ephemeral: true})
      } 
      if (i.customId === 'accept') {
          if (num1 > num2) {
          const result = new EmbedBuilder()
              .setColor('Random')
              .setTitle('<:diamond:990508369049686066>丨遊戲結果')
              .setDescription(`<@${user.id}> 的數字: ${num1}\n<@${ememy.id}> 的數字: ${num2}`)
              .addFields({ name: '比對結果', value: `<@${user.id}> 獲勝\n獲得 ${money} 點`, inline: true })
              .setTimestamp()
          interaction.editReply({content: `比對中...`, embeds:[],components: []}).then(()=>{
              i.update({content:" ", embeds: [result], components:[]});
          })
          // await wait(3500);
          Data.Wallet += money;
          Data2.Wallet -= money;
          await Data.save();
          await Data2.save();
        } else if (num1 < num2) {
          const result = new EmbedBuilder()
              .setColor('Random')
              .setTitle('<:diamond:990508369049686066>丨遊戲結果')
              .setDescription(`<@${user.id}> 的數字: ${num1}\n${ememy.tag} 的數字: ${num2}`)
              .addFields({ name: '比對結果', value: `<@${ememy.id}> 獲勝\n獲得 ${money} 點`, inline: true })
              .setTimestamp()
          interaction.editReply({content: `比對中...`, embeds:[],components: []}).then(()=>{
              i.update({content:" ", embeds: [result], components:[]});
          })
          Data.Wallet -= money;
          Data2.Wallet += money;
          await Data.save();
          await Data2.save();
          // await wait(3500);
          
        } else {
          const result = new EmbedBuilder()
              .setColor('Random')
              .setTitle('<:diamond:990508369049686066>丨遊戲結果')
              .setDescription(`<@${user.id}> 的數字: ${num1}\n${ememy.tag} 的數字: ${num2}`)
              .addFields({ name: '比對結果', value: `**雙方平手**\n各獲得 1 點`, inline: true })
              .setTimestamp()
          interaction.editReply({content: `比對中...`, embeds:[],components: []}).then(()=>{
              i.update({content:" ", embeds: [result], components:[]});
          })
          Data.Wallet += 1;
          Data2.Wallet += 1;
          await Data.save();
          await Data2.save();
          // await wait(3500);
      } 
    }
    if (i.customId === 'dd') {
      const aabab = new EmbedBuilder()
      .setColor('Random')
      .setDescription(`<@${ememy.id}> 拒絕了 <@${user.id}> 的邀請!`)
      .setTimestamp()
      .setTitle('雙人比大小 - 邀請')
      interaction.editReply({content:'', embeds:[aabab], components:[]})
    }
    })
  } catch (error) {
    console.log(`/雙人比大小 有錯誤: ${error}`);
    const errorCode = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
      .setDescription("如果不能排除，請通知給作者!:") 
      .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
      .setTimestamp()  
      return await interaction.followUp({embeds: [errorCode]})
  }
}
