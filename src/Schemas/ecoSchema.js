import {model , Schema} from 'mongoose'

let ecoSchema = new Schema({
  Guild: String,
  User: String,
  Bank: Number,
  Wallet: Number
})
export default model('ecoSchema', ecoSchema);
