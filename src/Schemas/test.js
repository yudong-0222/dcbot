import {model , Schema} from 'mongoose'

let testSchema = new Schema({
  GuildID: String,
  UserID: String
})

export default model('testSchema', testSchema);
