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
  
  process.on('unhandledRejection', (err) => {
    console.error('機器人遇到未處理的Promise問題:', err);
    
  });
  
  process.on('uncaughtException', (err) => {
    console.error('未捕捉到的異常:', err);
  });

  await mongoose.connect(mongoDBURL || '', {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  if(mongoose.connect) { console.log("database onlie!")}

}