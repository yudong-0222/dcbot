import {EmbedBuilder, SlashCommandBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'

const cooldown = 60000 * 30;
const timeout = new Set();
let cooldownTimeout;

export const command = new SlashCommandBuilder()
.setName('搶銀行')
.setDescription('經濟系統 - 搶銀行指令')
.addStringOption(
  option => option
  .setName('搶劫地點')
  .setDescription('搶劫地點，不同地點的利潤與成功機會皆不同!但冷卻時間均相同')
  .setRequired(true)
  .addChoices(
    {name: "第一銀行", value: "第一銀行", chance: 12, cooldown: 30000, earn: 192},
    {name: "第二銀行", value: "第二銀行", chance: 24, cooldown: 30000, earn: 130},
    {name: "第三銀行", value: "第三銀行", chance: 34, cooldown: 30000, earn: 90},
  )
)


export const action = async (interaction) => {  
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const { options, user, guild} = interaction;
    if (timeout.has(interaction.user.id)) {
      const remainingTime = cooldown - (Date.now() - cooldownTimeout);
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      
      
      const timeE = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('<a:wrong:1085174299628929034>丨指令仍在冷卻中!')
        .setDescription(`<a:load:1084371236836081674> 你還剩下：\`${minutes}\`分 \`${seconds}\` 秒`);

      return await interaction.reply({ embeds: [timeE], ephemeral: true });
    }
    let Data = await ecoSchema.findOne({Guild: guild.id, User: user.id})
    if(!Data) return interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法進行搶劫 <a:bunbun:991105824170713088>\n因為你沒有帳戶`, ephemeral: true});

    const location = options.get('搶劫地點').value;
      switch (location) {
        case "第一銀行":
          let totalChance = Math.round(Math.random()+1 + Math.random()+2)*13;
          let totalEarn = Math.round(Math.random()* 192)*39;
          console.log(totalChance);
          if(totalChance > 60) {
            Data.Wallet += totalEarn;
            Data.save();

            const success = new EmbedBuilder()
            .setColor('Green')
            .setTitle('<a:checked:1086296113818128414> | 成功搶劫 ' + location)
            .setDescription(`<a:coin1:1087317662998208602> 你的總收益：\`` + totalEarn + '\`')

            await interaction.reply({embeds: [success], ephemeral: true})
          } else {
            const fail = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<a:Animatederror:1086903258993406003> | 搶劫 ' + location + ' 失敗')
            .setDescription(`<a:coin1:1087317662998208602> 你的總收益：\`0\` `)

            await interaction.reply({embeds: [fail], ephemeral: true})
          }

          break;
        case "第二銀行":
          let totalChance2 = Math.round(Math.random()*2 + Math.random()*2)*15;
          let totalEarn2 = Math.round(Math.random()* 130)*11;
          console.log(totalChance2);
          if(totalChance2 > 30) {
            Data.Wallet += totalEarn2;
            Data.save();

            const success = new EmbedBuilder()
            .setColor('Green')
            .setTitle('<a:checked:1086296113818128414> | 成功搶劫 ' + location)
            .setDescription(`<a:coin1:1087317662998208602> 你的總收益：\`` + totalEarn2 + '\`')

            await interaction.reply({embeds: [success], ephemeral: true})
          } else {
            const fail = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<a:Animatederror:1086903258993406003> | 搶劫 ' + location + ' 失敗')
            .setDescription(`<a:coin1:1087317662998208602> 你的總收益：\`0\` `)

            await interaction.reply({embeds: [fail], ephemeral: true})
          }
          break;
        case "第三銀行":
          let totalChance3 = Math.round(Math.random()*2 + Math.random()*2)+1;
          let totalEarn3 = Math.round(Math.random()* 50)*10;
          console.log(totalChance3);
          if(totalChance3 >= 3) {
            if(totalChance3 !=0){
              Data.Wallet += totalEarn3;
              Data.save();
            } else {
              Data.Wallet += 250;
              Data.save();
            }
            const success = new EmbedBuilder()
            .setColor('Green')
            .setTitle('<a:checked:1086296113818128414> | 成功搶劫 ' + location)
            .setDescription(`<a:coin1:1087317662998208602> 你的總收益：\`` + totalEarn3 + '\`')

            await interaction.reply({embeds: [success], ephemeral: true})
          } else {
            const fail = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<a:Animatederror:1086903258993406003> | 搶劫 ' + location + ' 失敗')
            .setDescription(`<a:coin1:1087317662998208602> 你的總收益：\`0\` `)

            await interaction.reply({embeds: [fail], ephemeral: true})
          }
          break;          
      }
      // 設定冷卻時間
      timeout.add(interaction.user.id);
      cooldownTimeout = Date.now();
      setTimeout(() => {
        timeout.delete(interaction.user.id);
      }, cooldown);
      
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
} 