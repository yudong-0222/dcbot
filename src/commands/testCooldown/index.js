import {Embed, EmbedBuilder, SlashCommandBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'

export const command = new SlashCommandBuilder()
.setName('cooldown')
.setDescription('冷卻測試')

const cooldowns = new Map();

export const action = async (interaction) =>{
  const appStore = useAppStore()
  const client = appStore.client;
  const now = Date.now();
  const cooldownSeconds = 10;
  const User = interaction.user.id;

  if (cooldowns.has(User)) {
    const cooldownEnd = cooldowns.get(User) + cooldownSeconds * 1000;
    const secondLeft = Math.round((cooldownEnd - now) / 1000 );

    if (now < cooldownEnd) {
      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`<a:Animatederror:1086903258993406003>|你無法使用此指令!`)
      .setDescription(`你必須要等 \`${secondLeft}\` 秒`)

      return await interaction.reply({embeds: [embed]});
    }
  }

  cooldowns.set(User, now);

  await interaction.reply('執行指令成功!')
}
