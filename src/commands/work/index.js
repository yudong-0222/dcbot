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
    const optionsla = jobs.map(job => ({
      label: job.name,
      value: job.worktime,
      description: job.description,
      emoji: '👨‍🏭'
    }));

    let pay = [];
    let nowJob = [];

    const haveJob = false;
    if(haveJob) {
      const already = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:Animatederror:1086903258993406003>丨你已經有工作了')
      .setDescription("📄 請查看以下資訊") 
      .addFields({name: `現正進行的工作:`, value: "```"+`${nowJob}`+"```"})
      .setTimestamp()  
      return await interaction.editReply({embeds: [already]})
    }
    const workMsg = new EmbedBuilder()
      .setColor('Random')
      .setTitle('<:jobs:1088446692262674492>丨工作列表')
      .setDescription("📄 請查看以下資訊") 
      .addFields({name: `現有之工作:`, value: "```"+`${nowJob}`+"```"})
      .setTimestamp()
    
    const components = (state) =>[
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('job-menu')
        .setPlaceholder('📃110人力銀行-工作選單')
        .setDisabled(state)
        .addOptions(optionsla)
        )
    ]

    const initialMessage = await interaction.reply({embes: [workMsg], components: components(false)});

    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponetCollector({
      filter,
      componentType: ComponentType.StringSelect
    });

    collector.on("collect", (interaction)=> {
      const [TheJobName] = jobs.values;
      const categoryMsg = new EmbedBuilder()
      .setTitle(`${TheJobName} 工作`)
      .setDescription(`這是一個工握`)
      .addFields({
        name:jobs.name,
        value:jobs.description+jobs.worktime
      })
      interaction.update({embeds: [categoryMsg]})
    });

    collector.on("end", ()=>{
      initialMessage.edit({ components: components(true)})
    })
  } catch (error) {
    console.log(`/打工 有錯誤: ${error}`);
    const errorCode = new EmbedBuilder()
    .setColor('Red')
    .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
    .setDescription("如果不能排除，請通知給作者!:") 
    .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
    .setTimestamp()  
    return await interaction.editReply({embeds: [errorCode]})
  }
}
