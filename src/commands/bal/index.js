import {SlashCommandBuilder,Client,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} from 'discord.js'
import {useAppStore} from '@/store/app'
import ecoSchema from '@/Schemas/ecoSchema'

export const command = new SlashCommandBuilder()
.setName('點數餘額')
.setDescription('經濟系統-點數餘額')

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  
  const {user, guild} = interaction;

  let Data = await ecoSchema.findOne({Guild: interaction.guild.id, User: user.id});

  if(!Data) return await interaction.reply({content: `你必須要有一個帳號才能查看這個\n使用`+" `/帳戶` "+`創建一個帳戶`, ephemeral: true});
  const wallet = Math.round(Data.Wallet);
  const bank = Math.round(Data.Bank);
  const total = Math.round(Data.Wallet + Data.Bank);


  const embed = new EmbedBuilder()
  .setColor('#333166')
  .setTitle(`<:icon_nitrosubscriber:1084372743593676840> 信用點數餘額`)
  .addFields({name: "所剩信用點數餘額", value: `**銀行:** $${bank}\n**錢包:** $${wallet}\n**加總:** $${total}`})

  await interaction.reply({embeds: [embed]});
}