import {PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import ecoSchema from '../../Schemas/ecoSchema'


export const command = new SlashCommandBuilder()
.setName('addcredit')
.setDescription('only staff can use')
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
.addUserOption(option => 
  option.setName('使用者')
  .setDescription('對象')
  .setRequired(true) 
  )
.addStringOption(option =>
    option.setName('點數')
    .setDescription('增加的點數數量')
    .setRequired(true)
  )

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  try {
    await interaction.deferReply();
    const amount = interaction.options.getString('點數')
    const tar = interaction.options.getUser('使用者')
    let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: tar.id});
    if(!Data) return await interaction.editReply({name: `<a:wrong:1085174299628929034>丨他沒有帳戶`, ephemeral: true});

    const Converted = Number(amount);

    
    Data.Wallet += Converted;
    await Data.save();
    let wal = Math.round(Data.Wallet);
    const e = new EmbedBuilder()
    .setColor('Green')
    .setTitle(`<a:checked:1086296113818128414>丨已增加 ${amount} 點`)
    .setDescription(`${tar.tag} 的錢包現在有 ${wal} 點`)
    .addFields({name: `Description:`, value: `你增加 ${amount} 點 到 **${tar.tag}** 的錢包中!`})
      
    await interaction.editReply({embeds: [e]})

  } catch (error) {
    console.log(`/Add 有錯誤: ${error}`);
  }
  
}
