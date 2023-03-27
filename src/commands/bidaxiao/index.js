import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

var timeout = []

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

const embedss = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨請稍等一下!')
	.setDescription('你執行指令的速度太快了!')
	.setTimestamp()

export const command = new SlashCommandBuilder()
.setName('比大小')
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
    if (timeout.includes(interaction.user.id)) return await interaction.reply({embeds: [embedss], ephemeral: true})
    const appStore = useAppStore()
    const client = appStore.client;
    const cost = interaction.options.getString('點數')
    const ememy = interaction.options.getUser('使用者');
    const Converted = Number(cost)

    const {user} = interaction

    let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id});
    let Data2 = await ecoSchema.findOne({Guild: interaction.guild.id, User: ememy.id});
    if(ememy.id === user.id) return await interaction.reply({content: '<a:Animatederror:1086903258993406003>丨你不能和自己遊玩', ephemeral: true})
    if(!Data || !Data2) return await interaction.reply({embeds: [noAccount]});
    
    const num1 = Math.round(Math.random()* 100);
    const num2 = Math.round(Math.random()* 100);
    const money = Math.round(Math.random() *10) + cost*2;

    if (cost.startsWith('-')) return interaction.reply({content: `<a:wrong:1085174299628929034>丨不能輸入負數!` ,ephemeral: true}) 
    if (cost > Data.Wallet || cost > Data2.Wallet ) {
      if(cost > Data2.Wallet+Data2.Bank){
        const noMoneyData2 = new EmbedBuilder()
        .setColor('Red')
        .setTitle(`<a:wrong:1085174299628929034>丨${ememy.tag} 沒有這麼多點數!`)
        .setDescription('`/點數餘額` 查看當前的餘額有多少')
        .addFields({name: `解決方法:`, value: "`"+`/點數餘額`+"`"+` 查看餘額\n`+"可選方案: `"+`/提領`+"`"+` 將點數提領到錢包使用`})
        .setTimestamp()
        return await interaction.reply({embeds: [noMoneyData2], ephemeral: true})
      }
      if(cost > Data.Wallet+Data.Bank) {
        const noMoney = new EmbedBuilder()
        .setColor('Red')
        .setTitle(`<a:wrong:1085174299628929034>丨${user.tag} 沒有這麼多點數!`)
        .setDescription('`/點數餘額` 查看當前的餘額有多少')
        .addFields({name: `解決方法:`, value: "`"+`/點數餘額`+"`"+` 查看餘額\n`+"可選方案: `"+`/提領`+"`"+` 將點數提領到錢包使用`})
        .setTimestamp()
        return await interaction.reply({embeds: [noMoney], ephemeral: true})

      } else if(cost > Data.Wallet){
        Data.Wallet = 0;
        Data.Bank -= cost;
        await Data.save();
      } else if(cost > Data2.Wallet) {
        Data2.Wallet =0;
        Data2.Bank -= cost;
        await Data2.save();
      } else if (cost > Data.Bank) {
        Data.Bank = 0;
        Data.Wallet -= cost;
        Data.save();
      } else if (cost > Data2.Bank) {
        Data2.Bank =0;
        Data2.Wallet -= cost;
        Data2.save();
      }
    }

    if(isNaN(Converted) === true)  {
      const wrong = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:wrong:1085174299628929034>丨僅能輸入 `數字`')
      .setTimestamp()
      return await interaction.reply({embeds: [wrong], ephemeral: true})
    } 
    const btn = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('accept')
      .setLabel('同意遊玩')
      .setStyle(ButtonStyle.Success)
      .setEmoji(`<:xx:1074627080542765116>`),
      new ButtonBuilder()
      .setCustomId('dd')
      .setLabel('拒絕遊玩')
      .setStyle(ButtonStyle.Danger)
      .setEmoji(`<:error:1085154475070734357>`)
    );

    const eee = new EmbedBuilder()
    .setTitle(`<:diamond:990508369049686066>丨雙人比大小 - 邀請`)
    .setDescription(`<@${user.id}> 邀請 <@${ememy.id}> 遊玩**比大小**\n將花費你 \`${cost} 點\` 進行遊戲\n點擊下方的按鈕同意或拒絕`)
    interaction.reply({content:`<@${ememy.id}>`,embeds: [eee], components: [btn]})
    const collector = interaction.channel.createMessageComponentCollector({time: 30000});
    collector.on('collect', async i => {
      if(i.member.id === interaction.user.id || i.member.id != ememy.id) {
        return i.reply({content: `<a:Animatederror:1086903258993406003>丨你不是被邀請者`, ephemeral: true})
      }
      if (i.customId === 'accept') {
          if (num1 > num2) {
          const result = new EmbedBuilder()
              .setColor('Random')
              .setTitle('<:diamond:990508369049686066>丨遊戲結果')
              .setDescription(`<@${user.id}> 的數字: ${num1}\n<@${ememy.id}> 的數字: ${num2}`)
              .addFields({ name: '<a:Snowsgiving22_AnimatedEmojis_mal:1084361545947021373> 比對結果', value: `<@${user.id}> 獲勝\n獲得 ${money} 點`, inline: true })
              interaction.editReply({content: `<a:loading:1084371030774120549> 正在進行比對...\nhttps://tenor.com/view/numbers-crunching-gif-12718539`, embeds:[],components: []}).then(()=>{
            setTimeout(function() {
              interaction.editReply({content:" ", embeds: [result], components:[]});
            }, 3000);
          });
          // await wait(3500);
          if(money > Data2.Wallet+Data2.Bank){
            Data2.Wallet = 0;
            Data.Wallet += money;
            await Data.save();
            await Data2.save();
          } else {
            Data.Wallet += money;
            Data2.Wallet -= money;
            await Data.save();
            await Data2.save();
          }
        } else if (num1 < num2) {
          const result = new EmbedBuilder()
              .setColor('Random')
              .setTitle('<:diamond:990508369049686066>丨遊戲結果')
              .setDescription(`<@${user.id}> 的數字: ${num1}\n<@${ememy.id}> 的數字: ${num2}`)
              .addFields({ name: '<a:Snowsgiving22_AnimatedEmojis_mal:1084361545947021373> 比對結果', value: `<@${ememy.id}> 獲勝\n獲得 ${money} 點`, inline: true })
              .setTimestamp()
          interaction.editReply({content: `<a:loading:1084371030774120549> 正在進行比對...\nhttps://tenor.com/view/numbers-crunching-gif-12718539`, embeds:[],components: []}).then(()=>{
            setTimeout(function() {
              interaction.editReply({content:" ", embeds: [result], components:[]});
            }, 5000);
          });
          if (money > Data.Wallet+Data.Bank) {
            Data.Wallet = 0;
            Data2.Wallet += money;
            await Data.save();
            await Data2.save();
          } else {
            Data.Wallet -= money;
            Data2.Wallet += money;
            await Data.save();
            await Data2.save();
            // await wait(3500);
          }
        } else {
          const result = new EmbedBuilder()
              .setColor('Random')
              .setTitle('<:diamond:990508369049686066>丨遊戲結果')
              .setDescription(`<@${user.id}> 的數字: ${num1}\n<@${ememy.id}> 的數字: ${num2}`)
              .addFields({ name: '<a:Snowsgiving22_AnimatedEmojis_mal:1084361545947021373> 比對結果', value: `**雙方平手**\n各獲得 1 點`, inline: true })
              .setTimestamp()
              interaction.editReply({content: `<a:loading:1084371030774120549> 正在進行比對...\nhttps://tenor.com/view/numbers-crunching-gif-12718539`, embeds:[],components: []}).then(()=>{
            setTimeout(function() {
              interaction.editReply({content:" ", embeds: [result], components:[]});
            }, 3000);
          });
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
        .setDescription(`<a:Animatederror:1086903258993406003>丨<@${ememy.id}> 拒絕了 <@${user.id}> 的邀請!`)
        .setTimestamp()
        .setTitle('雙人比大小 - 邀請 <:tickets:1088132098784768090>')
        
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
  timeout.push(interaction.user.id);
  setTimeout(()=> {
    timeout.shift();
  },5000)
}
