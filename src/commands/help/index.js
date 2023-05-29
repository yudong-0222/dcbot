import {SlashCommandBuilder,EmbedBuilder,ActionRowBuilder, StringSelectMenuBuilder, Events} from 'discord.js'
import {useAppStore} from '@/store/app'


const appStore = useAppStore();
const client = appStore.client;
export const command = new SlashCommandBuilder()
.setName('幫助')
.setDescription('機器人的簡單指引🎁')

export const action = async (interaction) =>{

  const sel = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('a')
          .setMaxValues(1)
					.setPlaceholder('📃 選擇一個指令')
					.addOptions(
						{
							label: '📶 延遲',
							description: '取得我的延遲!',
							value: '1',
						},
						{
							label: '🐄 牛',
							description: '牛。我還沒想到要怎麼寫這xDD',
							value: '2',
						},
            {
							label: '📄 伺服器資訊',
							description: '取得伺服器的資訊',
							value: '3',
						},
            {
							label: '🤖 機器人資訊',
							description: '關於機器人的資訊。',
							value: '4',
						},
            {
							label: '😎 使用者資訊',
							description: '關於使用者的資訊',
							value: '5',
						},
            {
							label: '🎲 骰子遊戲',
							description: '扔骰子，比大小!',
							value: '6',
						},
            {
							label: '🤗 幫助',
							description: '你現在正在使用這個',
							value: '7',
						},
					),
			);
    
    const Help = new EmbedBuilder()
    .setColor("#939787")
    .setTitle(`${client.user.username}`)
    .setDescription("歡迎使用，你可以查看下面的所有指令 🥵")
    .addFields(
      { name: '使用下面的選單選出您想要尋求幫助的指令吧', value: ' ' },
      { name: '`/` 斜線指令已啟用✅', value: '使用 / 作為前綴來使用指令', inline: true },
    )
    .setTimestamp()
    .setFooter({ text: '@2023 KOSHKA-LENGEND', iconURL: 'https://i.imgur.com/clEn73Q.gif' });
    interaction.reply({embeds: [Help],components: [sel] });

}
