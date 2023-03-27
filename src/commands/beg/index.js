import {SlashCommandBuilder,Client,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

var timeout = [];

const embedss = new EmbedBuilder()
	.setColor('Red')
	.setTitle('<a:wrong:1085174299628929034>丨請稍等一下!')
	.setDescription('你執行指令的速度太快了!')
	.setTimestamp()

export const command = new SlashCommandBuilder()
.setName('社會實驗')
.setDescription('經濟系統-社會實驗(你有極大的機率輸錢😈)')

export const action = async (interaction) =>{
  if (timeout.includes(interaction.user.id)) return await interaction.reply({embeds: [embedss], ephemeral: true})
  let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id});
  if(!Data) {
    const noAccount = new EmbedBuilder()
    .setColor('Red')
    .setTitle(`<a:Animatederror:1086903258993406003>丨你無法參與社會實驗`)
    .setDescription(`因為你沒有帳戶!\n\`/帳戶\`創建一個帳戶!`)
    return await interaction.reply({embeds: [noAccount], ephemeral: true});
  }

  await interaction.deferReply();
  const appStore = useAppStore()
  const client = appStore.client;

  const {user, guild} = interaction;

  let negative = Math.round((Math.random() * -300) - 15);
  let positive = Math.round((Math.random() * 300) + 10);

  const posN = [negative, positive];
  const amount = Math.round((Math.random() * posN.length))
  const value= posN[amount]

  if(!value) {
    const notValue = new EmbedBuilder()
    .setColor('Red')
    .setTitle('社會實驗')
    .addFields({name: "實驗結果", value:`你甚麼都沒拿到`})

    return interaction.editReply({embeds: [notValue], ephemeral: true})
  }
  if(Data) {
    Data.Wallet += value;
    await Data.save();
  }
  
  if(value > 0) {
    const positiveChoices = [
      "天上掉下來一坨屎，你吃掉了並且獲得",
      "你睡覺睡到抖一下，所以你獲得了",
      "樂透頭獎不是你的，但你還是獲得了",
      "沃！你掉到了後室，在裡面發現了",
      "跟蹤狂突然出現在你身後，哭著給你這些點數",
      "社會組獎勵:",
      "自然組獎勵:",
      "你忘了給飛機加油了，助攻得到",
      "在大樓裡連到飛機網路，今天還是911\n阿拉伯合作夥伴獲得:",
      "你大便大到腳麻，點數獲得",
      "你夢到了周公 你與周公下棋贏得點數",
    ]

    const posName = Math.round(Math.random() * positiveChoices.length);
    const embed1 = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`社會實驗`)
    .addFields({name: '實驗結果', value: `${positiveChoices[[posName]]} $${value}`})

    await interaction.editReply({embeds: [embed1]});
  } else {
    const negativeChoices = [
      "天上掉下來一捆錢，你收起來但被扣除了",
      "睡醒之後又睡著，你的點數被鬧鐘扣除了",
      "樂透頭獎是你的!但政府稅收收走了",
      "你努力為黨付出，但你只是韭菜，什麼都沒有，點數被扣除",
      "當你努力準備了半年，結果輸給1.35分，點數被奪走",
      "飛機生小孩了，是個小男孩，點數被燒毀",
      "做了三小時的報告，然後沒有保存，你很優秀，被偷走點數",
      "你使用 `裸考`，你獲得了0分，因此被上古卷軸收走點數",
      "你跟世界之眼對到眼，但你根本不知道這是什麼，所以點數被收走",
      "UNKNOWN MAGIC MAKE YOUR CREDITS LOST! YOU HAVE BEEN LOST",
      "Discord 發現你有異狀行為，所以收走了你的點數共",
      "在同學大便的時候大喊:**多吃菜喔**,因此被清算，點數被沖走",
      "一切都往好的方向發展。但你被扣除",
      "指令魔杖發現你有極大的才華，所以你的點數被魔杖吃掉了",
      "你沒有使用surfshark VPN 點數扣除",
    ]

    const negName = Math.round((Math.random() * negativeChoices.length));
    const stringV = `${value}`;

    const nonSymbol = await stringV.slice(1);

    const embed2 = new EmbedBuilder()
    .setColor('Random')
    .setTitle('社會實驗')
    .addFields({name: "實驗結果", value:`${negativeChoices[[negName]]} $${nonSymbol}`})

    await interaction.editReply({embeds: [embed2]});
  }
  
  timeout.push(interaction.user.id);
  setTimeout(()=> {
    timeout.shift();
  },3000)
}
