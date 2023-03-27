import {model , Schema} from 'mongoose'

let ecoSchema = new Schema({
  Guild: String,
  User: String,
  Bank: Number,
  Wallet: Number,
  lastDaily: Date,
  isWorking: Boolean
})
export default model('ecoSchema', ecoSchema);
