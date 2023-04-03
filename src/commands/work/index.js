import {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Embed, SelectMenuBuilder, ComponentType} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'
import { StringSelectMenuBuilder } from '@discordjs/builders'
import workSchema from '../../Schemas/workSchema'
import { queuePostFlushCb } from 'vue'

const cooldowns = new Map();
const banzhuangCooldown = new Map();
let isCancel = false;
let bait = 20; //魚餌
let wailao = 3; //外籍看護的體力
let banzhuang = 10; //磚頭數量 可改
const DefaultBanzhuang = 10; // 總磚頭數量
let baitRestoreTimer = null;
let wailaoRestoreTimer = null;




export const command = new SlashCommandBuilder()
.setName('打工')
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
.addSubcommand(cmd=>
  cmd
  .setName('捕魚')
  .setDescription('漁夫的工作!')
  )
.addSubcommand(cmd=>
  cmd
  .setName('照護')
  .setDescription('外籍看護工作! 單次工作最高可達250點!')
  )
.addSubcommand(cmd=>
  cmd
  .setName('搬磚')
  .setDescription('工地人的工作!')
  )
.addSubcommand(cmd=>
  cmd
  .setName('搬磚結束')
  .setDescription('結算當前的搬磚!必須是工地人才能使用的')
  )


export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const {user} = interaction
    const now = Date.now();
    const cooldownSeconds = 300;
    let timerId;

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
      .setDescription("> 帳戶必須使用最新版本 `v0.356` 的帳戶\n> 聽不懂? 就用 `/帳戶` 重創一支\n<a:pinkcheckmark:1084383521155592212>重創之前,記得先截圖記得自己的餘額\n再進行後續的補償喔!") 
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
      .setDescription("📄 請使用下列選單選擇一項工作")
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
    switch(command) { //找工作
      case '找工作':
        if(Data.isWorking === null) {
          const oldAccount = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:wrong:1085174299628929034>丨你的帳號仍是舊版!')
          .setDescription("> 帳戶必須使用最新版本 `v0.356` 的帳戶\n> 聽不懂? 就用 `/帳戶` 重創一支\n<a:pinkcheckmark:1084383521155592212>重創之前,記得先截圖記得自己的餘額\n再進行後續的補償喔!") 
          .setTimestamp()
          return await interaction.reply({embeds: [oldAccount], components:[],ephemeral: true});
        }


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
                      value: '使用 \`/打工 開課\` 進行授課\n工作時間5分鐘\n工資將在5分鐘後給予\n<:agy:1087683155135320064>如果中途中斷,則拿不到工資'
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
                      value: '使用 \`/打工 捕魚\` 進行捕魚\n每捕到一隻可以獲利50點\n魚餌20隻\n每五分鐘恢復一隻\n或者至商店購買'
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
                      value: '使用 \`/打工 照護\` 進行工作\n總體力值: `3` \n每工作一次體力值-1 直到=0\n每 `10` 分鐘恢復`1體力值`\n薪資範圍: `10點 ~ 250點`\n不會有沒拿到薪資的問題'})
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
                      value: '使用 \`/打工 搬磚\` 進行工作\n使用 \`/打工 搬磚結束\` 在工作到一半的時候結算工資\n總共 `10塊` 磚頭\n每搬一次磚 `休息時間=搬磚數量*2`\n在磚頭剩下 `0` 個時候 使用 `/打工 搬磚` 即可獲得本次工資'
                    })
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
        if(Data.isWorking === null) {
          const oldAccount = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:wrong:1085174299628929034>丨你的帳號仍是舊版!')
          .setDescription("> 帳戶必須使用最新版本 `v0.356` 的帳戶\n> 聽不懂? 就用 `/帳戶` 重創一支\n<a:pinkcheckmark:1084383521155592212>重創之前,記得先截圖記得自己的餘額\n再進行後續的補償喔!") 
          .setTimestamp()
          return await interaction.reply({embeds: [oldAccount], components:[],ephemeral: true});
        }
        if(Data.isWorking === false){
          return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你目前沒有工作! <:jobs:1088446692262674492> \n使用 \`/打工 找工作\` 尋找一個工作吧!`, ephemeral: true});
        }
        isCancel = true;
        const cacelJob = new EmbedBuilder()
        .setColor('Red')
        .setTitle('<:warn:1085138987636752414>丨確定要取消工作嗎')
        .setDescription("如果你的工資是在工作完成之後才拿到\n**取消工作將會拿不到任何工資!**\n\`\`\`\請確認是否要取消?`\`\`") 
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
        
        if (cooldownSeconds > 0) {
          const cancelMsg = await interaction.reply({embeds: [cacelJob], components:[btn,btn2], ephemeral: true})
          const collect = cancelMsg.createMessageComponentCollector({ComponentType: ComponentType.Button})
          collect.on("collect", async(i)=> {
            if(i.customId === 'yes' && i.member.id === user.id) {
              const yesIdo = new EmbedBuilder()
              .setColor('Green')
              .setTitle('<a:pinkcheckmark:1084383521155592212>丨你結束了你的工作')
              .setDescription(`因為提早結束,所以你沒有拿到任何工資 <a:moneyanimated:1089137556496584805>`)
              .setTimestamp()  
              Data.isWorking = false;
              await Data.save();
              workla.Work = "";
              await workla.save();
              if (timerId) clearTimeout(timerId)
              timerId = null;
              return await interaction.editReply({embeds: [yesIdo], components: [], ephemeral: true})
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
          const secondLeft = Math.floor((cooldownEnd - now) / 1000, 0);
            if (0 < secondLeft) { 
                  const min = Math.floor(secondLeft / 60);
                  const sec = Math.floor(secondLeft % 60);
                  const embed = new EmbedBuilder()
                  .setColor('Red')
                  .setTitle(`<a:Animatederror:1086903258993406003>|工作尚未結束!`)
                  .setDescription(`你還需要等\`${min}\`分 \`${sec}\` 秒\n才能再次使用!`)

                  return interaction.reply({embeds: [embed]})
            }
          }
        cooldowns.set(user, now);//
        if (!(workla.Work === "老師")) {
          const notThisJob = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你不是 **老師**\n`/打工` 來尋找一份打工") 
          .setTimestamp()

          return await interaction.reply({embeds: [notThisJob]})
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
        .setTitle(`👨‍🏫 | 名師開課 <a:checked:1086296113818128414>`)
        .setDescription(`${doThings[[doThingN]]} $${pay}`);
        await interaction.reply({embeds: [lastMessage], components: []});
        if (!isCancel) {
          clearTimeout(timerId)
          timerId = setTimeout(async()=>{
            if (!isCancel) {
              Data.Bank += pay;
              await Data.save();
            } else {
              clearTimeout(timerId)
              timerId = null;
              return;
            }
          }, 30 * 60 * 1000)
        }
      }

    /*捕魚*/
    switch(command) {
      case "捕魚":
        if (Data.isWorking=== false) {
          const noJobs = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你當前沒有工作\n`/打工` 來尋找一份打工") 
          .setTimestamp()
          return await interaction.reply({embeds: [noJobs]});
        }
        if (!(workla.Work === "漁夫")) {
          const notThisJob = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你不是 **漁夫**\n`/打工` 來尋找一份打工") 
          .setTimestamp()
          return await interaction.reply({embeds: [notThisJob]})
        } 
        if (bait < 0) {
          const NoBait = new EmbedBuilder()
          .setTitle('<a:Animatederror:1086903258993406003> | 你不能再捕魚了')
          .setDescription(`因為你現在沒有魚餌!`)
          return await interaction.reply({embeds: [NoBait]});
        }
        var resultNum = ["0","1"]
        let getGoTimes = resultNum[Math.floor(Math.random()* resultNum.length)]
        var fishList = [1,2,3,4,5]; //魚的數量
        let fish = fishList[Math.floor(Math.random()* fishList.length)]
        if (getGoTimes === "0") {
          bait --;
          const failMsg = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`🎣 | 出海結果`)
            .setDescription(`你沒有補到任何一條魚`)
            .addFields({name: `🍥 **剩餘魚餌:**`, value: ` \`${bait}\` 隻`})
          return await interaction.reply({embeds: [failMsg], components: []});
        } else {
          if (fish >= bait && bait != 0) fish = bait;
          let pay = (fish*50);
          bait -= fish;
          Data.Bank += pay;
          await Data.save();
          const successMsg = new EmbedBuilder()
          .setColor('Green')
          .setTitle(`🎣 | 出海結果`)
          .setDescription(`你坐在船上好久，終於聽到網子有動靜\n你捕獲了 \`${fish}\` 條魚`)
          .addFields({name: `<a:purpleCard:1086599525726175292> **總獲利:**`, value: ` \`${pay}\` 點`})
          .addFields({name: `🍥 **剩餘魚餌:**`, value: ` \`${bait}\` 隻`})
          await interaction.reply({embeds: [successMsg], components: []});
        }
        if (bait < 20  && !baitRestoreTimer) {
          baitRestoreTimer = setInterval(()=> {
            if (bait < 20) {
              bait++;
            } else {
              clearInterval(baitRestoreTimer);
              baitRestoreTimer = null;
            }
          }, 30 * 10 * 1000)
        }
      }

    /*照護*/
    switch(command) {
      case "照護":
        if(Data.isWorking === false){
          return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你目前沒有工作! <:jobs:1088446692262674492> \n使用 \`/打工 找工作\` 尋找一個工作吧!`, ephemeral: true});
        }

        if (!(workla.Work === "外籍看護")) {
          const notThisJob = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你不是 **外籍看護**\n`/打工` 來尋找一份打工") 
          .setTimestamp()
          return await interaction.reply({embeds: [notThisJob]})
        } 

        if (wailao != 0) {
            const payS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,20,25];
            let pay = 10 * payS[Math.floor(Math.random() * payS.length)];
            var wailaoContry = ["菲律賓","印尼","臺灣","日本","張英祈的豪宅",]
            let location = wailaoContry[Math.floor(Math.random() * wailaoContry.length)]
            wailao --;
            Data.Bank += pay;
            await Data.save()
            const didJob = new EmbedBuilder()
            .setTitle('🧕 | 勞動結果')
            .setColor('Green')
            .setDescription(`🗺️ 仲介公司派你到 \`${location}\` 服務\n做了 掃地、拖地、煮菜、洗碗、換尿布`)
            .addFields({name: `<a:coin1:1087317662998208602> 獲得工資: \`${pay}\` 點`, value: ` `})
            .addFields({name: `<a:arrowla:1092355535766044764> 剩餘體力: \`${wailao} / 3\``, value: ` `})
            .addFields({name: `<a:arrowla:1092355535766044764> 體力每 \`10分鐘\` 恢復 \`1 點\`體力值`, value: ` `})

            await interaction.reply({embeds: [didJob]})
        } else {
          const noEnger = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003> | 無法進行照護!')
          .setDescription(`因為你當前沒有體力了!`)
          .addFields({name: `<a:arrowla:1092355535766044764> 體力:`, value: `\`${wailao} / 3\` 點體力值`})
          .addFields({name: `<a:arrowla:1092355535766044764> 恢復方法:`, value: `每10分鐘恢復 \`1\` 體力值`})

          await interaction.reply({embeds: [noEnger], ephemeral: true})
        }
        if (wailao < 3  && !wailaoRestoreTimer) {
          wailaoRestoreTimer = setInterval(()=> {
            if (wailao < 3) {
              wailao++;
            } else {
              clearInterval(wailaoRestoreTimer);
              wailaoRestoreTimer = null;
            }
          }, 60 * 10 * 1000)
        }   
    }

    /*搬磚*/
    switch(command) {
      case "搬磚":
        if(Data.isWorking === false){
          return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你目前沒有工作! <:jobs:1088446692262674492> \n使用 \`/打工 找工作\` 尋找一個工作吧!`, ephemeral: true});
        }
        if (!(workla.Work === "工地人")) {
          const notThisJob = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你不是 **工地人**\n`/打工` 來尋找一份打工") 
          .setTimestamp()
          return await interaction.reply({embeds: [notThisJob]})
        } 


        let totalBanzhaung = DefaultBanzhuang - banzhuang;
        let restTime = 2; //搬磚 n 次 休息 2n 分鐘
        // let restTime = totalBanzhaung *2*60; //搬磚 n 次 休息 2n 分鐘
        let payment = 50 * totalBanzhaung;


        if (banzhuangCooldown.has(user)) {
          let cooldownEnd = banzhuangCooldown.get(user) + restTime * 1000;
          const secondLeft = Math.floor((cooldownEnd - now) / 1000, 0);
            if (0 < secondLeft) { 
                  const min = Math.floor(secondLeft / 60);
                  const sec = Math.floor(secondLeft % 60);
                  const embed = new EmbedBuilder()
                  .setColor('Red')
                  .setTitle(`<a:Animatederror:1086903258993406003> | 你還在鷹架上休息!`)
                  .setDescription(`你還需要等\`${min}\`分 \`${sec}\` 秒\n才能再次使用!`)

                  return interaction.reply({embeds: [embed], ephemeral: true})
            }
        }
        banzhuangCooldown.set(user, now);
        //工作主體    
        if (banzhuang != 0) {
          banzhuang--;
          const banzhuanging = new EmbedBuilder()
          .setColor('Orange')
          .setTitle('👷‍♂️ | 搬磚時間!🧱')
          .setDescription(`<a:sadapple:1090276424537083914> 你勤奮的搬磚...🧱`)
          .addFields({name: `🧱 磚頭數: \`${banzhuang} 🧱 / ${DefaultBanzhuang} 🧱\``, value: ` `})
          .addFields({name: `🧱 領工資❓`, value: `1️⃣ 使用 \`/打工 搬磚結束\` 進行結算\n2️⃣ 把磚頭全部搬完`})

          await interaction.reply({embeds: [banzhuanging]})
        } else {
          Data.Bank+= payment;
          await Data.save();
          const banzhaungEnd = new EmbedBuilder()
          .setColor('Green')
          .setTitle('👷‍♂️ | 搬磚完成!!🧱')
          .setDescription(`<a:sadapple:1090276424537083914> 你勤奮的搬磚...🧱\n並且成功地完成了所有搬磚任務`)
          .addFields({name: `🧱 你一共搬了: \`${totalBanzhaung}\` 次磚`, value: ` `})
          .addFields({name: `🧱 這裡是你的工資: \`${payment}\` 點`, value: ` `})
          
          await interaction.reply({embeds: [banzhaungEnd]})
          Data.isWorking = false;
          await Data.save();
          workla.Work ="";
          await workla.save();
        } 

    }

    /*搬磚結束*/
    switch(command) {
      case "搬磚結束":
        if(Data.isWorking === false){
          return await interaction.reply({content: `<a:wrong:1085174299628929034>丨你目前沒有工作! <:jobs:1088446692262674492> \n使用 \`/打工 找工作\` 尋找一個工作吧!`, ephemeral: true});
        }
        if (!(workla.Work === "工地人")) {
          const notThisJob = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003>丨你無法使用!')
          .setDescription("原因:\n因為你不是 **工地人**\n`/打工` 來尋找一份打工") 
          .setTimestamp()
          return await interaction.reply({embeds: [notThisJob]})
        } 
        //結算主體
        let totalBanzhaung = DefaultBanzhuang - banzhuang;
        let payment = 50 * totalBanzhaung;

        if (banzhuang != 0 && banzhuang != DefaultBanzhuang) {
          const endBan = new EmbedBuilder()
          .setColor('Orange')
          .setTitle('👷‍♂️ | 結算搬磚 🧱')
          .setDescription(`<a:sadapple:1090276424537083914> 你勤奮的搬磚...🧱\n並且在 **所有磚頭搬完之前** 結算了`)
          .addFields({name: `🧱 你一共搬了: \`${totalBanzhaung} 次磚\``, value: ` `})
          .addFields({name: `🧱 獲得的工資: \`${payment} 點\``, value: ` `})
          .addFields({name: `🧱 當前工作狀態: \`待業中\``, value: ` `})

          Data.Bank += payment;
          await Data.save();
          Data.isWorking = false;
          await Data.save();
          workla.Work = "";
          await workla.save();
          return await interaction.reply({embeds: [endBan]})
        } else if(banzhuang === DefaultBanzhuang) {
          const noDidAnything = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003> | 無法結算搬磚 🧱')
          .setDescription(`<a:sadapple:1090276424537083914> 因為你根本沒有搬磚`)
          
          await interaction.reply({embeds: [noDidAnything], ephemeral: true})
        } else {
          const isZero = new EmbedBuilder()
          .setColor('Red')
          .setTitle('<a:Animatederror:1086903258993406003> | 無法結算搬磚 🧱')
          .setDescription(`<a:sadapple:1090276424537083914> 錯誤代碼: \`EorIsZero\` \n請將錯誤代碼回報給作者`)
          .addFields({name: `<:discordbughunter2:1085932298345656340> 解決方法`, value: `再嘗試一次 \`/打工 搬磚\`\n如果還是不行,請回報給作者`})
          
          return await interaction.reply({embeds: [isZero]})
        }
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