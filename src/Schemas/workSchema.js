import {model , Schema} from 'mongoose'

let workSchema = new Schema({
  Guild: String,
  User: String,
  Work: String,
})

export default model('workSchema', workSchema);
