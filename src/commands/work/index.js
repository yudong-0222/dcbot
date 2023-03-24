import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Embed, SelectMenuBuilder, ComponentType} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'
import { StringSelectMenuBuilder } from '@discordjs/builders'

export const command = new SlashCommandBuilder()
.setName('job')
.setDescription('經濟系統-打工指令(BETA版)')
.addSubcommand(cmd=>
  cmd
  .setName('找工作')
  .setDescription('在打工之前,都需要一份工作.收國中畢業,這不看學歷.')
  )
.addSubcommand(cmd=>
  cmd
  .setName('釣魚')
  .setDescription('漁夫是一個相當恬淡的職業,釣魚就可以賺錢')
  )
.addSubcommand(cmd=>
  cmd
  .setName('開課')
  .setDescription('老師是一個相當血汗的職業,開課賺錢,還可能被學生罵')
  )
.addSubcommand(cmd=>
  cmd
  .setName('開始照護')
  .setDescription('外籍看護是一個相當特殊的職業,居家照護')
  )
.addSubcommand(cmd=>
  cmd
  .setName('搬磚')
  .setDescription('工地人是一個相當體力活的工作,搬磚賺錢,還可能閃到腰')
  )


export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const {user} = interaction
    const cmd = interaction.options.getSubcommand();
    let Data = ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});
    if(!Data) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法進行打工 <:jobs:1088446692262674492> \n因為你沒有帳戶`, ephemeral: true});
    
    const jobs =[
      {
        name: "老師",
        worktime: "5", //分鐘
        description: "師者,所以傳道授業解惑也",
      },
      {
        name: "漁夫",
        worktime: "15", //5分鐘冷卻]
        description: "夫以狩魚為主,觀景為輔,乘舟而搏",
      },
      {
        name: "外籍看護",
        worktime: "5", //5分鐘冷卻]
        description: "照護乃雪髮住伴.行即有汝",
      },
      {
        name: "工地人",
        worktime: "60", //60分鐘冷卻]
        description: "工地乃一區未建,材器散,僅數鋼筋佇\n體壯而行,體弱而勤",
      },
    ];


    const firstMsg = new EmbedBuilder()
      .setColor('Random')
      .setTitle('<:jobs:1088446692262674492>丨工作列表')
      .setDescription("📄 請查看以下資訊") 
      .setTimestamp()

      const jobSelect = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('job-menu')
        .setPlaceholder(`📃110人力銀行 - 工作查詢`)
        .addOptions(
          jobs.map(job=>({
            label: job.name,
            value: job.name,
            description: job.description,
          }))
        )
      )
      const selectionRespond = await interaction.reply({embeds: [firstMsg], components: [jobSelect]})
      const collector = await selectionRespond.createMessageComponentCollector({ ComponentType: ComponentType.StringSelect})
      switch(cmd) {
        case '找工作':
          collector.on("collect", async (i)=>{
            const value = i.values[0]
              if (i.customId === "job-menu") {
                if(value === ("老師")) {
                  const teacher = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 老師')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${value}`,
                      value: '(暫定) 老師\n開課 由群組人員進來聽課數量為主\n 越多人錢越多\n工作時間5分鐘'
                    })
                    .setTimestamp()

                  const btn = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId('teacher')
                    .setLabel('選擇此工作')
                    .setStyle(ButtonStyle.Success)
                  )

                  i.reply({embeds: [teacher], components: [btn], ephemeral:true})
                }
                /*NExt*/    
                if (value === "漁夫") {
                  const fish = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 漁夫')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${value}`,
                      value: '(暫定) 釣魚\n以圖表方式來釣魚\n每釣到一隻增加50點 \n工作時間最多15分鐘 \n5分鐘後才可進行下次釣魚工作'
                    })
                    .setTimestamp()

                  const btn = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId('fisher')
                    .setLabel('選擇此工作')
                    .setStyle(ButtonStyle.Success)
                  )

                  i.reply({embeds: [fish], components: [btn], ephemeral:true})
                  
                }
                /*NExt*/
                if (value === "外籍看護") {
                  const fish = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 外籍看護')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${value}`,
                      value: '(暫定) 照顧雇主\n滿足雇主一個需求 由Dc內完成\n完成後雇主需給看護一筆金額 >200點\n若雇主給予<200\n系統由雇主存款裡扣除>1000的數量給予受雇者'
                    })
                    .setTimestamp()

                  const btn = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId('walao')
                    .setLabel('選擇此工作')
                    .setStyle(ButtonStyle.Success)
                  )

                  i.reply({embeds: [fish], components: [btn], ephemeral:true})
                }
                /*NExt*/                
                if (value === "工地人") {
                  const fish = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 工地人')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${value}`,
                      value: '(暫定) 搬磚 搬一個50點\n一次可搬五次（最多可得250點）\n可以中途中斷\n由於體力活1小時後才可再工作一次'
                    })
                    .setTimestamp()

                  const btn = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId('gondi')
                    .setLabel('選擇此工作')
                    .setStyle(ButtonStyle.Success)
                  )

                   i.reply({embeds: [fish], components: [btn], ephemeral:true})
                }
                /*NExt*/
              }
          })
          collector.on("collect", async(b) => {
            if(b.customId === "teacher") {
              const choseMsg = new EmbedBuilder()
              .setColor('Green')
              .setTitle('<a:48:1086689450714730506>丨確認你的選擇')
              .setDescription("📄 你選擇了下述職業")
              .addFields({
                name: `選擇的職業`,
                value: `${jobs[0].name}`
              }) 
              .setTimestamp()
              interaction.editReply({embeds: [choseMsg],ephemeral: true, components: []});
            }
            if (b.customId === "fisher") {
              const choseMsg = new EmbedBuilder()
              .setColor('Green')
              .setTitle('<a:48:1086689450714730506>丨確認你的選擇')
              .setDescription("📄 你選擇了下述職業")
              .addFields({
                name: `選擇的職業`,
                value: `${jobs[1].name}`
              }) 
              .setTimestamp()
              interaction.editReply({embeds: [choseMsg],ephemeral: true, components: []});    
            }
            if (b.customId === "walao") {
              const choseMsg = new EmbedBuilder()
              .setColor('Green')
              .setTitle('<a:48:1086689450714730506>丨確認你的選擇')
              .setDescription("📄 你選擇了下述職業")
              .addFields({
                name: `選擇的職業`,
                value: `${jobs[2].name}`
              }) 
              .setTimestamp()
              interaction.editReply({embeds: [choseMsg],ephemeral: true, components: []});    
            }
            if (b.customId === "fisher") {
              const choseMsg = new EmbedBuilder()
              .setColor('Green')
              .setTitle('<a:48:1086689450714730506>丨確認你的選擇')
              .setDescription("📄 你選擇了下述職業")
              .addFields({
                name: `選擇的職業`,
                value: `${jobs[3].name}`
              }) 
              .setTimestamp()
              interaction.editReply({embeds: [choseMsg],ephemeral: true, components: []});    
            }
          })
        }

  

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
