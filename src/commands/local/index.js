import {SlashCommandBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'

export const command = new SlashCommandBuilder()
.setName('local')
.setDescription('測試本地化語言')


export const action = async (interaction) =>{
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const locales = {
      "zh-TW": '你好世界！',
      "en-US": 'Hello World！'
    };
    console.log(interaction.locale);
    interaction.reply(locales[interaction.locale] ?? 'eddd World');
  } catch (error) {
    
  }
}
