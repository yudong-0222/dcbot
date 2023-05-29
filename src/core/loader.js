import {REST,Routes,Collection} from 'discord.js'
import fg from 'fast-glob'
import { useAppStore } from '@/store/app'



const updateSlashCommands = async(commands) => {
  const rest = new REST({version:10}).setToken(process.env.TOKEN)
  const result = await rest.put(
    Routes.applicationCommands(process.env.APPID),
    {
      body: commands,
    }
  )
  console.log(result)
}

export const loadCommands = async() => {
  const appStore = useAppStore()
  const commands = []
  const actions = new Collection()
  const files = await fg('./src/commands/**/index.js')

  for(const file of files) {
    const cmd = await import(file)
    commands.push(cmd.command)
    actions.set(cmd.command.name, cmd.action)
  }

  await updateSlashCommands(commands)
  appStore.commandsActionMap = actions

  console.log(appStore.commandsActionMap)

}

export const loadEvents = async() => {
  const appStore = useAppStore()
  const client = appStore.client
  const files = await fg('./src/events/**/index.js')
  for (const file of files) {
    const eventFILE = await import(file)

    if(eventFILE.event.once) {
      client.once(
        eventFILE.event.name, 
        eventFILE.action
        
      ) 
    } else {
      client.on(
        eventFILE.event.name, 
        eventFILE.action
      ) 
    }
  }
}