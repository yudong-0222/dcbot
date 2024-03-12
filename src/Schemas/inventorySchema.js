import {model , Schema} from 'mongoose'

let inventorySchema = new Schema({
  Guild: String,
  User: String,
  Inventory: Object,
})
export default model('inventorySchema', inventorySchema);
