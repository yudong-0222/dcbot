import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Embed, SelectMenuBuilder, ComponentType} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'
import { StringSelectMenuBuilder } from '@discordjs/builders'

export const command = new SlashCommandBuilder()
.setName('job')
.setDescription('經濟系統-打工指令(BETA版)')

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const {user} = interaction
    let Data = ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});
    if(!Data) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法進行打工 <:jobs:1088446692262674492> \n因為你沒有帳戶`, ephemeral: true});
    
    const jobs =[
      {
        name: `老師`,
        worktime: `5`, //分鐘
        description: `師者,所以傳道授業解惑也`
      },
      {
        name: `漁夫`,
        worktime: `15`, //5分鐘冷卻]
        description: `夫以狩魚為主,觀景為輔,乘舟而搏`
      }
    ];


    const jobSelect = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
      .setCustomId('job-menu')
      .setPlaceholder(`📃110人力銀行 - 工作查詢`)
      .addOptions(
        jobs.map(job=>({
          label: job.name,
          value: job.worktime,
          description: job.description,
        }))
      )
    )
    const firstMsg = new EmbedBuilder()
      .setColor('Random')
      .setTitle('<:jobs:1088446692262674492>丨工作列表')
      .setDescription("📄 請查看以下資訊") 
      .setTimestamp()

    const selectionRespond = await interaction.reply({embeds: [firstMsg], components: [jobSelect]})
    

    const collector = await selectionRespond.createMessageComponentCollector({ ComponentType: ComponentType.StringSelect})
    collector.on("collect", async (i)=>{
      if (i.customId === "job-menu") {
        console.log("yes");
        const value = i.values[0];
        if (value === `老師`) {
          return i.reply({content: `老師...`})
        }
        if (value === `漁夫`) {
          return i.reply({content: `漁夫有多餘`})
        }
      }
    })




  } catch (error) {
    console.log(`/打工 有錯誤: ${error}`);
    const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.reply({embeds: [errorCode]})
  }
}
