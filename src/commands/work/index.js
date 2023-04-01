import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Embed, SelectMenuBuilder, ComponentType} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'
import { StringSelectMenuBuilder } from '@discordjs/builders'
import workSchema from '../../Schemas/workSchema'

const cooldowns = new Map();

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
  .setName('取消工作')
  .setDescription('取消工作,你將領不到任何工資!')
  )
.addSubcommand(cmd=>
  cmd
  .setName('開課')
  .setDescription('老師的工作!')
  )

export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const {user} = interaction
    const now = Date.now();
    const cooldownSeconds = 300;

    let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});
    if(!Data) return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法進行打工 <:jobs:1088446692262674492> \n因為你沒有帳戶`, ephemeral: true});
    let workla = await workSchema.findOne({Guild: interaction.guild.id, User: user.id})
    if (!workla) {
      workla = new workSchema ({
        Guild: interaction.guild.id,
        User: user.id,
        Work: "",
      })
      await workla.save();
    }
    if(Data.isWorking === null) {
      const oldAccount = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:wrong:1085174299628929034>丨你的帳號仍是舊版!')
      .setDescription("> 帳戶必須使用最新版本 `v0.354` 的帳戶\n> 聽不懂? 就用 `/帳戶` 重創一支\n<a:pinkcheckmark:1084383521155592212>重創之前,記得先截圖記得自己的餘額\n再進行後續的補償喔!") 
      .setTimestamp()
      return await interaction.reply({embeds: [oldAccount], components:[],ephemeral: true});
    }

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
        worktime: "15", //5分鐘冷卻]
        description: "異國伴客,隨行隨履,回首處,汝在",
      },
      {
        name: "工地人",
        worktime: "15", //5分鐘冷卻]
        description: "工地乃一處僅鋼筋佇立之處,乃粗重,乃悶熱.高俸祿而勞",
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
        .setPlaceholder(`📃8964苦力銀行 - 工作查詢`)
        .addOptions(
          jobs.map(job=>({
            label: job.name,
            value: job.name,
            description: job.description,
          }))
        )
      )

    const command = interaction.options.getSubcommand();
    switch(command) {
      case '找工作':
          if(Data.isWorking === true) return await interaction.reply({components: [], embeds: [], content: `<a:wrong:1085174299628929034>丨你無法尋找工作! <:jobs:1088446692262674492> \n因為你已經有工作了\n> 你的工作是: \`${workla.Work}\``, ephemeral: true})
          const selectionRespond = await interaction.reply({embeds: [firstMsg], components: [jobSelect]})
          const collector = await selectionRespond.createMessageComponentCollector({ ComponentType: ComponentType.StringSelect, ComponentType: ComponentType.Button})
          collector.on("collect", async (i)=>{
              if (i.customId === "job-menu" && user.id === i.member.id) {
                const value = i.values[0]
                const lastMsg = new EmbedBuilder()
                .setColor('Green')
                .setTitle('<a:48:1086689450714730506>丨打工開始!')
                .setDescription(`📄 你選擇了 **${i.values}** 這份工作`) 
                .setTimestamp()

                /*jobs if conditional*/
                if(value === ("老師")) {
                  const teacher = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 老師')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${i.values}`,
                      value: '(暫定) 老師\n開課 由群組人員進來聽課數量為主\n 越多人錢越多\n工作時間5分鐘'
                    })
                    .setTimestamp()
                    try {
                        const btn = new ActionRowBuilder()
                        .addComponents(
                          new ButtonBuilder()
                          .setCustomId('tea')
                          .setLabel('選擇此工作')
                          .setStyle(ButtonStyle.Success)
                        )
                      i.reply({embeds: [teacher], ephemeral: true, components: [btn]})
                      collector.on("collect", async (b)=> {
                        if(b.customId === "tea" && b.member.id === user.id) {
                          if(Data.isWorking) return i.editReply({components: [], embeds: [], content: `<a:wrong:1085174299628929034>丨你無法尋找工作! <:jobs:1088446692262674492> \n因為你已經有工作了\n> 你的工作是: \`${workla.Work}\``, ephemeral: true})
                          Data.isWorking = true;
                          await Data.save();
                          workla.Work = "老師";
                          await workla.save();
                          i.editReply({components: [], embeds: [lastMsg]})
                        }
                      })
                    } catch (error) {
                      console.log(`有錯誤!: ${error}`);
                    }
                }

                /*漁夫 conditions*/
                if(value === ("漁夫")) {
                  const teacher = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 漁夫')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${i.values}`,
                      value: '(暫定) 釣魚\n以~~圖表~~方式來釣魚\n每釣到一隻增加50點\n工作時間最多15分鐘\n即停止\b**5分鐘後才可進行下次釣魚工作**'
                    })
                    .setTimestamp()
                    try {
                        const btn = new ActionRowBuilder()
                        .addComponents(
                          new ButtonBuilder()
                          .setCustomId('fisher')
                          .setLabel('選擇此工作')
                          .setStyle(ButtonStyle.Success)
                        )
                      i.reply({embeds: [teacher], ephemeral: true, components: [btn]})
                      collector.on("collect", async (b)=> {
                        if(b.customId === "fisher" && b.member.id === user.id) {
                          if(Data.isWorking) return i.editReply({components: [], embeds: [], content: `<a:wrong:1085174299628929034>丨你無法尋找工作! <:jobs:1088446692262674492> \n因為你已經有工作了\n> 你的工作是: \`${workla.Work}\``, ephemeral: true})
                          Data.isWorking = true;
                          await Data.save();
                          workla.Work = "漁夫";
                          await workla.save();
                          i.editReply({components: [], embeds: [lastMsg]})
                        }
                      })
                    } catch (error) {
                      console.log(`有錯誤!: ${error}`);
                    }
                  }


                /*外籍看護 conditions*/
                if(value === ("外籍看護")) {
                  const teacher = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 外籍看護')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${i.values}`,
                      value: '(暫定)照顧雇主\n滿足雇主一個需求\n由Dc內完成\n完成後雇主需給看護一筆金額 >200點\n若雇主給予<200\n系統由雇主存款裡扣除>1000 的數量給予受雇者'
                    })
                    .setTimestamp()
                    try {
                        const btn = new ActionRowBuilder()
                        .addComponents(
                          new ButtonBuilder()
                          .setCustomId('watcher')
                          .setLabel('選擇此工作')
                          .setStyle(ButtonStyle.Success)
                        )
                      i.reply({embeds: [teacher], ephemeral: true, components: [btn]})
                      collector.on("collect", async (b)=> {
                        if(b.customId === "watcher" && b.member.id === user.id) {
                          if(Data.isWorking) return i.editReply({components: [], embeds: [], content: `<a:wrong:1085174299628929034>丨你無法尋找工作! <:jobs:1088446692262674492> \n因為你已經有工作了\n> 你的工作是: \`${workla.Work}\``, ephemeral: true})
                          Data.isWorking = true;
                          await Data.save();
                          workla.Work = "外籍看護";
                          await workla.save();                      
                          i.editReply({components: [], embeds: [lastMsg]})
                        }
                      })
                    } catch (error) {
                      console.log(`有錯誤!: ${error}`);
                    }
                  }
                
                /*工地人 conditions*/
                if(value === ("工地人")) {
                  const teacher = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('<:jobs:1088446692262674492> - 工地人')
                    .setDescription("📄 請查看以下資訊") 
                    .addFields({
                      name:`工作名稱 - ${i.values}`,
                      value: '(暫定)搬磚時間暫定\n搬磚次數預計增加 \n相對休息時間增加 \n```example:搬磚5次 休息10分鐘 搬磚10次 休息20分鐘 ```\n以此類推。'
                    })
                    .setTimestamp()
                    try {
                        const btn = new ActionRowBuilder()
                        .addComponents(
                          new ButtonBuilder()
                          .setCustomId('workers')
                          .setLabel('選擇此工作')
                          .setStyle(ButtonStyle.Success)
                        )
                      i.reply({embeds: [teacher], ephemeral: true, components: [btn]})
                      collector.on("collect", async (b)=> {
                        if(b.customId === "workers" && b.member.id === user.id) {
                          if(Data.isWorking) return i.editReply({components: [], embeds: [], content: `<a:wrong:1085174299628929034>丨你無法尋找工作! <:jobs:1088446692262674492> \n因為你已經有工作了\n> 你的工作是: \`${workla.Work}\``, ephemeral: true})
                          Data.isWorking = true;
                          await Data.save();
                          workla.Work = "工地人";
                          await workla.save();                  
                          i.editReply({components: [], embeds: [lastMsg]})
                        }
                      })
                    } catch (error) {
                      return console.log(`有錯誤!: ${error}`);
                    }
                  }
                
              } 
              
          })
      }

      /*取消工作*/
    switch(command) {
      case '取消工作':
        if(Data.isWorking === false){
          return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你目前沒有工作! <:jobs:1088446692262674492> \n使用 \`/打工 找工作\` 尋找一個工作吧!`, ephemeral: true});
        }
        const cacelJob = new EmbedBuilder()
        .setColor('Red')
        .setTitle('<:warn:1085138987636752414>丨確定要取消工作嗎')
        .setDescription("如果你取消工作,那麼你將無法拿到本次的工資\n**不管做多久,沒做完都一樣拿不到**\n\`\`\`\請確認是否要取消?`\`\`") 
        .setTimestamp()  

        const btn = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('yes')
          .setLabel('是的!我要取消')
          .setEmoji(`<a:checked:1086296113818128414>`)
          .setStyle(ButtonStyle.Success)
        )

        const btn2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('no')
          .setLabel('我沒有要取消')
          .setEmoji(`<a:Animatederror:1086903258993406003>`)
          .setStyle(ButtonStyle.Danger)
        )


        const cancelMsg = await interaction.reply({embeds: [cacelJob], components:[btn,btn2], ephemeral: true})
        const collect = cancelMsg.createMessageComponentCollector({ComponentType: ComponentType.Button})
        collect.on("collect", async(i)=> {
          if(i.customId === 'yes' && i.member.id === user.id) {
            const yesIdo = new EmbedBuilder()
            .setColor('Green')
            .setTitle('<a:pinkcheckmark:1084383521155592212>丨你結束了你的工作')
            .setDescription(`因為提早結束,所以你沒有拿到任何工資 <a:moneyanimated:1089137556496584805>`)
            .setTimestamp()  
            await interaction.editReply({embeds: [yesIdo], components: [], ephemeral: true})
            Data.isWorking = false;
            await Data.save();
            workla.Work = "";
            await workla.save();
            console.log(`${Data.isWorking} 公厝狀態`);
          }
          if (i.customId === 'no' && i.member.id === user.id) {
            const noIdont = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<a:checkpurple:1089136864168001556>丨你保留了你的工作')
            .setTimestamp()  
            return interaction.editReply({embeds: [noIdont], components: [], ephemeral: true})
          }
        })
    }

    /*開課*/
    switch(command) {
      case "開課":
        if (Data.isWorking=== false) {
          const noJobs = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你當前沒有工作\n`/打工` 來尋找一份打工") 
          .setTimestamp()
          return await interaction.reply({embeds: [noJobs]});
        }
        if (cooldowns.has(user)) {
          const cooldownEnd = cooldowns.get(user) + cooldownSeconds * 1000;
          const secondLeft = Math.round((cooldownEnd - now) / 1000 );
          
            if (0 < cooldownEnd) {
                  const min = Math.floor(secondLeft / 60);
                  const sec = Math.floor(secondLeft % 60);
                  const embed = new EmbedBuilder()
                  .setColor('Red')
                  .setTitle(`<a:Animatederror:1086903258993406003>|工作尚未結束!`)
                  .setDescription(`你還需要等\`${min}\`分 \`${sec}\` 秒\n才能再次使用!`)

                  return await interaction.reply({embeds: [embed]})
            }
          }
        
        cooldowns.set(user, now);
        

        await interaction.deferReply({ephemeral: false});
        if (!(workla.Work === "老師")) {
          const notThisJob = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你不是 **老師**\n`/打工` 來尋找一份打工") 
          .setTimestamp()

          return await interaction.editReply({embeds: [notThisJob]})
        } 
        let pay = Math.round(Math.random() * 33 ) + 120;
        if (pay >= 150) pay = 150;
        const doThings = [
          "> 使用 **摸魚**: 這節課自修\n預估 \`5分鐘\` 後得到 <a:coin1:1087317662998208602>",
          "> **認真教學**,開課獲得學生青睞\n預估\`5分鐘\` 後得到 <a:coin1:1087317662998208602>",
          "> **履行《師說》的內容**,傳其道解其惑也\n預估\`5分鐘\` 後得到 <a:coin1:1087317662998208602>",
          "> <:p_:867801170055921674> **肥龍式幹話**的教學方式\n預估\`5分鐘\` 後得到 <a:coin1:1087317662998208602>",
          "> <a:eggcat:1084364519599521792> **考試**,這堂課你超爽\n預估\`5分鐘\` 後得到 <a:coin1:1087317662998208602>",
        ];
        const doThingN = Math.floor(Math.random() * doThings.length);
        const lastMessage = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`👨‍🏫 | 名師開課 <a:green_tick:994529015652163614>`)
        .setDescription(`${doThings[[doThingN]]} $${pay}`);
        await interaction.editReply({embeds: [lastMessage], components: []});
          setTimeout(async() => {
            if (Data.isWorking === true) {
              Data.Bank += pay;
              await Data.save();
              console.log("send monety");
            } else {
              return;
            }
          },  10 * 1000)

    }

    /**/
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