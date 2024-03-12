import {EmbedBuilder, SlashCommandBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

var timeout = [];

const timeE = new EmbedBuilder()
.setColor('Orange')
.setTitle('<a:wrong:1085174299628929034>丨通緝仍然懸賞中!')
.setDescription(`請待到通緝懸賞解除! ${timeout}`)
.addFields({name: `說明:`, value: `**搶劫指令仍在冷卻中!**`})

const noMoneyTorob = new EmbedBuilder()
.setColor('Red')
.setTitle('<a:wrong:1085174299628929034>|你無法搶劫他')
.setDescription(`> 他身上沒有錢QQ`)

export const command = new SlashCommandBuilder()
.setName('搶劫')
.setDescription('經濟系統 - 搶劫指令')
.addUserOption(option => option.setName('使用者').setDescription('搶劫對象').setRequired(true))

export const action = async (interaction) => {
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const { options, user, guild} = interaction;
    if(timeout.includes(interaction.user.id)) return await interaction.reply({embeds: [timeE],ephemeral:true})

    const userStealing = options.getUser('使用者');
    let Data = await ecoSchema.findOne({Guild: guild.id, User: user.id})
    let DataUser = await ecoSchema.findOne({Guild: guild.id, User: userStealing.id})

    if(!Data) return  interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法進行搶劫 <a:bunbun:991105824170713088>\n因為你沒有帳戶`, ephemeral: true});
    if(userStealing == interaction.user) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法搶劫你自己 <a:bunbun:991105824170713088>`, ephemeral: true});
    if(!DataUser) return  interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法搶劫他\n因為該使用者沒有帳戶 <a:bunbun:991105824170713088>`, ephemeral: true});
    if(DataUser.Wallet <= 0) return  interaction.reply({embeds: [noMoneyTorob], ephemeral: true});

    let negative = Math.round((Math.random()* 500)+10);
    let positive = Math.round((Math.random()* 500) + 10 + negative*0.35);

    const posN = [negative, positive];

    const amount = Math.round(Math.random() * posN.length);
    const value = posN[amount]

    if (value > 0) {
      const positiveChoices=[
        "你偷走他的點數，得到了",
        "你成功地奪走了他的財物，真是個狠心的小偷！奪得",
        "偷東西可不是好習慣，但你的技巧確實不錯，得到",
        "偷東西是要付出代價的，但你似乎輕鬆地奪走了他的",
        "恭喜！你成功地搶劫了，現在你可以好好享受這些點數：",
        "好樣的！，搶劫真是太有趣了，你偷走了",
        "太厲害了！現在可以去買點東西慶祝了!你成功地搶到了",
        "!你成功地搶到了",
        "太厲害了！學校教你怎麼搶劫的嗎 搶到了",
        "神偷之手，你搶到了",
        "太厲害了！現在可以去買點東西慶祝了!你成功地搶到了",
      ]
      const posName = Math.floor(Math.random() * positiveChoices.length);

      const begEmbed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('<a:bunbun:991105824170713088> 搶劫成功!')
      .addFields({name: `${user.tag} **搶劫了** ${userStealing.tag}`,value: `${positiveChoices[[posName]]} ${value}`});
      try {
        interaction.reply({embeds: [begEmbed]})

      } catch (error) {
        console.log(`begEmbed: ${error}`);
      }
      
      Data.Wallet += value;
      await Data.save();

      DataUser.Wallet -= value;
      await DataUser.save();

    } else if(value < 0) {
      if(isNaN(value)) return  interaction.reply({content: `> <a:bunbun:991105824170713088> 他發現你要搶劫他了\n> 所以他打給了警察\n> 但你很幸運地逃走了。沒有任何損失!`, ephemeral: true})
        
      const beblostEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('<a:wrong:1085174299628929034> 搶劫失敗! <a:bunbun:991105824170713088> ')
        .addFields({name: `${user} **搶劫了** ${userStealing}`,value: `> 但你失敗了...`});
      try {
        interaction.reply({embeds: [beblostEmbed]})
      } catch (error) {
        console.log(`belostEmbed: ${error}`);
      }
    }
  } catch (error) {
    console.log(`/搶劫 有錯誤 ${error}`);
    const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return  interaction.reply({embeds: [errorCode]})
  }
  timeout.push(interaction.user.id);
    setTimeout(()=>{
      timeout.shift();
    }, 5000);
}