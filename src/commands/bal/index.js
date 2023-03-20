import {SlashCommandBuilder,Client,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

export const command = new SlashCommandBuilder()
.setName('點數餘額')
.setDescription('經濟系統-點數餘額')

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    
    const {user, guild} = interaction;
  
    let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});
  
    if(!Data) return await interaction.reply({content: `> 你必須要有一個帳號才能查看這個\n使用`+" `/帳戶` "+`創建一個帳戶`, ephemeral: true});
    const wallet = Math.round(Data.Wallet);
    const bank = Math.round(Data.Bank);
    const total = Math.round(Data.Wallet + Data.Bank);
  
  
    const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`<a:Payments_Nitro:1084373683285540905> **${user.tag} 的社會信用點數**`)
    .addFields({name: "<:bank1:1087311639587606629> **銀行:**", value: "`"+`${bank} 點`+"`", inline: true})
    .addFields({name: `<:wallet:1087311994778026006> **錢包:**`, value: "`"+`${wallet} 點`+"`", inline: true})
    .addFields({name: `<:sum:1087312409515008061> **加總:**`, value: "`"+`${total} 點`+"`", inline: true})
    .addFields({name: `<a:Payments_Nitro:1084373683285540905> 點數使用說明`, value: ` `})
    .addFields({name: `購買 **軍火庫的武器**`, value: `軍火庫的武器\n能有效提升搶劫成功機率`, inline: true})
    .addFields({name: `購買 <a:coin1:1087317662998208602>**股票幣** 投資股票`, value: `股票系統\n一個能讓你成為\n神之操盤手的秘密市場`, inline: true})
    .addFields({name: `遊玩 <:game_die:1087319438019272714>骰子遊戲`, value: `經典的擲骰子\n與人機比大小!`, inline: true})
    .addFields({name: `參與 <a:expe:1087319933165248593>社會實驗`, value: `由▓博士計畫的秘密實驗`, inline: true})
    .addFields({name: `<a:Payments_Nitro:1084373683285540905> 點數獲取方法`, value: ` `})
    .addFields({name: `遊玩 <:game_die:1087319438019272714>骰子遊戲`, value: `最保障的賺點數方式\n全下不會全輸!`, inline: true})
    .addFields({name: `參與 <a:expe:1087319933165248593>社會實驗`, value: `高風險的實驗投資\n高報酬\n但同時高失敗機率`, inline: true})
    .addFields({name: `領取 <:information:1086592637546532905>每日獎勵`, value: `/每日獎勵\n是你開啟新一天的好幫手`, inline: true})
    .addFields({name: `進行 <a:bunbun:991105824170713088>使用者搶劫`, value: `使用 /搶劫 使用者名稱\n搶劫他的錢包!`, inline: true})
    .addFields({name: `進行 <a:bunbun:991105824170713088>銀行搶劫`, value: `<a:Animatederror:1086903258993406003> 此指令尚未新增`, inline: true})
    .addFields({name: `參與 <:ticket:1087321781808939019>股票投資`, value: `<a:Animatederror:1086903258993406003> 此指令尚未新增`, inline: true})
    .addFields({name: `進行 <:ak47:1087322588096765982>販賣軍火`, value: `<a:Animatederror:1086903258993406003> 此指令尚未新增`, inline: true})
    .addFields({name: `遊玩 <:point:1087324093927411823>雙人比大小`, value: `<a:Animatederror:1086903258993406003> 此指令尚未新增`, inline: true})
    .addFields({name: `╠NO IDEA╣`, value: `<a:Animatederror:1086903258993406003> 此指令等待新增`, inline: true})
    await interaction.reply({embeds: [embed], ephemeral: true});
     
  } catch (error) {
    console.log(`/點數餘額 有錯誤 ${error}`);
    const errorCode = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
      .setDescription("如果不能排除，請通知給作者!:") 
      .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
      .setTimestamp()  
      return await interaction.reply({embeds: [errorCode]})
  }
}