import {SlashCommandBuilder,Client,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} from 'discord.js'
import {useAppStore} from '@/store/app'
import ecoSchema from '../../Schemas/ecoSchema'

export const command = new SlashCommandBuilder()
.setName('社會實驗')
.setDescription('經濟系統-賺點數')

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  
  const {user, guild} = interaction;

  let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id});

  let negative = Math.round((Math.random()* -300)-10)
  let positive = Math.round((Math.random()*300)+10)

  const posN = [negative, positive];
  const amount = Math.round((Math.random() * posN.length ))
  const value= posN[amount]

  if(!value) return await interaction.reply({content: `你甚麼都沒拿到 :D`, ephemeral: true})

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
      "在大樓裡連到飛機網路，今天還是911\n阿拉伯合作夥伴獲得:"
    ]

    const posName = Math.round(Math.random() * positiveChoices.length);
    const embed1 = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`社會實驗`)
    .addFields({name: '實驗結果', value: `${positiveChoices[[posName]]} $${value}`})

    await interaction.reply({embeds: [embed1]});
  } else {
    const negativeChoices = [
      "天上掉下來一捆錢，你收起來但被扣除了",
      "睡醒之後又睡著，你的點數被鬧鐘扣除了",
      "樂透頭獎是你的!但政府收稅收了",
      "你努力為黨付出，但你只是韭菜，什麼都沒有，點數被扣除",
      "當你努力準備了半年，結果輸給1.35分，點數被奪走",
      "飛機生小孩了，是個小男孩，點數被燒毀",
      "做了三小時的報告，然後沒有保存，你很優秀，被偷走點數"
    ]

    const negName = Math.round((Math.random() * negativeChoices.length));
    const stringV = `${value}`;

    const nonSymbol = await stringV.slice(1);

    const embed2 = new EmbedBuilder()
    .setColor('Random')
    .setTitle('社會實驗')
    .addFields({name: "實驗結果", value:`${negativeChoices[[negName]]} $${nonSymbol}`})


    await interaction.reply({embeds: [embed2]});
  }
  


}