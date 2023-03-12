import {Events} from "discord.js"
import mongoose from 'mongoose'

const mongoDBURL = process.env.MONGODBURL
export const event = {
  name: Events.ClientReady,
  once: true,
}

export const action = async(c) => {
  console.log(`已登入 ${c.user.tag}`);
  if(!mongoDBURL) return;
  
  await mongoose.connect(mongoDBURL || '', {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  if(mongoose.connect) { console.log("database onlie!")}

}