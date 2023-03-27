import {SlashCommandBuilder,EmbedBuilder,ActionRowBuilder, StringSelectMenuBuilder, Events} from 'discord.js'
import {useAppStore} from '../../store/app'


const appStore = useAppStore();
const client = appStore.client;
export const command = new SlashCommandBuilder()
.setName('幫助')
.setDescription('機器人的簡單指引🎁')
const action = async (interaction) =>{

    const Help = new EmbedBuilder()
    .setColor("#939787")
    .setTitle(`${client.user.username}`)
    .setDescription("歡迎使用，你可以查看下面的所有指令 <:help:1085139950485393468>")
    .addFields(
      { name: '使用下面的選單選出您想要尋求幫助的指令吧', value: ' ' },
      { name: '`/` 斜線指令已啟用 <a:pickcheckmark:1084383521155592212>', value: '使用 / 作為前綴來使用指令 <:dev:1085136540918882324>', inline: true },
    )
    .setTimestamp()
    .setFooter({ text: '@2023 KOSHKA-LENGEND', iconURL: 'https://i.imgur.com/clEn73Q.gif' });
    interaction.reply({embeds: [Help],components: [sel] });

}
