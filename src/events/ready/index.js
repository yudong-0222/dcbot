import {Events} from "discord.js"

export const event = {
  name: Events.ClientReady,
  once: true,
}

export const action = (c) => {
  console.log(`已登入 ${c.user.tag}`);
}