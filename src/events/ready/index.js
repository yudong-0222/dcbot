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
  
  process.on('unhandledRejection', async (err) => {
    console.error('機器人遇到未處理的 Promise 問題:', err);
  });

  // 設定未捕捉的異常處理程序
  process.on('uncaughtException', async (err) => {
    console.error('未捕捉到的異常:', err);
  });

  await mongoose.connect(mongoDBURL || '', {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  if(mongoose.connect) { console.log("database onlie!")}

}