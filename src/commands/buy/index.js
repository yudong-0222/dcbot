import {EmbedBuilder, SlashCommandBuilder} from 'discord.js'
import {useAppStore} from '../../store/app'
import inventorySchema from '../../Schemas/inventorySchema'
import ecoSchema from '../../Schemas/ecoSchema'

import {shopItems} from "../../items/shopItems"

export const command = new SlashCommandBuilder()
.setName('商店系統')
.setDescription('商店系統 - 商店')
.addSubcommand(cmd=>
  cmd
  .setName('商品')
  .setDescription('打開所有商品列表')
  )
.addSubcommand(cmd=>
  cmd
  .setName('售出')
  .setDescription('售出商品')
  .addStringOption(option => 
    option
    .setRequired(true)
    .setDescription('售出的商品名稱')
    .setName('商品名稱')
    )
  .addIntegerOption(option => 
    option
    .setRequired(true)
    .setDescription('售出的商品數量')
    .setName('售出商品數量')
    )    
  )  
.addSubcommand(cmd=>
  cmd
  .setName('購買')
  .setDescription('購買商品')
  .addStringOption(option => 
    option
    .setRequired(true)
    .setDescription('購買商品的名稱')
    .setName('商品名稱')
    )
  .addIntegerOption(option => 
    option
    .setRequired(true)
    .setDescription('購買商品的數量')
    .setName('購買商品數量')
    )  
  )  
.addSubcommand(cmd=>
  cmd
  .setName('背包')
  .setDescription('你的背包')
  )  
.addSubcommand(cmd=>
  cmd
  .setName('清空背包')
  .setDescription('清空你的背包，在背包內的所有東西都將消失!')
  )  
// 商品列表
const shopA = new EmbedBuilder()
.setColor('Red')
.setTitle('<:hypesquadevents:1085932329094103131> | 商店系統')
.setDescription(`以下是所有已經上架的商品!`)
shopItems.forEach((itemsla) => {
  shopA.addFields({ name: '<:desc:1117134207441977387>商品名稱：' + `\`${itemsla.item}\``, value: '<:shopbag:1117134089275850833> 商品描述： `'+ itemsla.description + '`\n💰價格: `' + itemsla.price+ '`' ,inline: false});
});

// 按鈕
// const buttons = new ActionRowBuilder()
// shopItems.forEach((item, index) => {
//   buttons.addComponents(
//   new ButtonBuilder()
//   .setCustomId(`button_${index}`)
//   .setLabel(item.item)
//   .setStyle(ButtonStyle.Primary)
// )});


export const action = async (interaction) => {  
  try {
    const appStore = useAppStore()
    const client = appStore.client;
    const {user, guild} = interaction;
    let Data = await ecoSchema.findOne({Guild: guild.id, User: user.id})
    if(!Data) return interaction.reply({content: `<a:wrong:1085174299628929034>丨你無法使用商店\n因為你沒有帳戶`, ephemeral: true});
    let Inventory = await inventorySchema.findOne({Guild: guild.id, User: user.id});
    if(!Inventory) {
      Inventory = new inventorySchema({
        Guild: interaction.guild.id,
        User: user.id,
        Inventory: {}
      })
    }
    await Inventory.save();
    const command = interaction.options.getSubcommand();
    // interaction.deferReply();
    let itemBuy = "幹";
    itemBuy = interaction.options.getString("商品名稱");
    let itemBuyCount=0 ;
    itemBuyCount = interaction.options.getInteger('購買商品數量')

      switch(command) {
        case '商品':
          interaction.reply({embeds: [shopA], }) //components: [buttons]
          break;
        // case '售出':
        //   try {
        //     const itemSell = interaction.options.getString('商品名稱');
        //     const itemSellCount = interaction.options.getInteger('售出商品數量');
        //     //確認是否有商品/背包是否有足夠數量
        //     const sellSuccess = new EmbedBuilder()
        //     .setColor('Green')
        //     .setTitle('<a:checked:1086296113818128414> | 成功售出')
        //     .setDescription(`<@${interaction.user.id}> 已售出 **${itemSellCount}** 個 **【${itemSell}】**`)
        //     interaction.reply({embeds: [sellSuccess]});
        //     const sellFail = new EmbedBuilder()
        //     .setColor('Red')
        //     .setTitle('<a:Animatederror:1086903258993406003> | 售出失敗')
        //     .setDescription(`三源運算：判斷背包有沒有這個東西`)
            
            
        //     interaction.reply({embeds: [sellSuccess]});
        //     break;
        //   } catch (error) {
        //     console.log(`/售出有問題 ${error}`);
        //   }
        case '購買':
          // try {
            const validItem = shopItems.find((item) => item.item === itemBuy);
            const validItemMsg = new EmbedBuilder()
              .setColor('Red')
              .setTitle('<a:Animatederror:1086903258993406003> | 購買失敗')
              .setDescription(`\`${itemBuy}\` 並不存在! \n嘗試使用 \`/商店系統 商品\` 查看當前的庫存`);
        
            if (!validItem) return await interaction.reply({content: " " , embeds: [validItemMsg] });
            const itemPrice = shopItems.find((item) => item.item === itemBuy).price;
            const finalPrice = itemBuyCount * itemPrice;
            if (finalPrice > Data.Wallet) {
              const failTrade = new EmbedBuilder()
                .setColor('Red')
                .setTitle('<a:Animatederror:1086903258993406003> | 購買失敗')
                .setDescription(`你的餘額不足!\n此項商品至少需要 \`${itemPrice}點\``);
        
              return await interaction.reply({ embeds: [failTrade] });
            } else {
              if(!Inventory.Inventory[itemBuy]) Inventory.Inventory[itemBuy] = 0;
              Inventory.Inventory[itemBuy] += itemBuyCount;
              await interaction.reply(`你花費 ${finalPrice}點 購買了： ${itemBuy}`)
              Inventory = await inventorySchema.findOneAndUpdate({ Guild: guild.id, User: user.id }, Inventory);
              Data.Wallet -= finalPrice;
              await Data.save();
              await Inventory.save();
            }
          // } catch (error) {
          //   console.log(`/購買有問題：${error}`);
          // }
          break;
        case '背包':
          try {
            const mappedData = Inventory.Inventory ? Object.keys(Inventory.Inventory).map((key) => {
              return `\`${key} * ${Inventory.Inventory[key]}\``
            }).join(", ") : null;
            
            const bagMsg = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle('<:shopbag:1117134089275850833> 你的背包：')
            .setDescription(mappedData ? `${mappedData}` : `<:angrymention:1078902012638416976> \`背包空空如也 \``)
            return interaction.reply({embeds: [bagMsg]})
          } catch (error) {
            console.log(`/背包 錯誤: ${error}`);
          }
          break;
        case '清空背包':
          try {
            if(!Inventory.Inventory) {
              const nulled = new EmbedBuilder()
              .setColor('DarkRed')
              .setTitle('BAG-NULLED')
              .setDescription('\`Your bag is null, you can not delete it!\`')
              return await interaction.reply({embeds: [nulled]})
            }
            await inventorySchema.deleteOne({ Guild: interaction.guild.id, User: user.id });
            const bagMsg = new EmbedBuilder()
              .setColor('DarkRed')
              .setTitle('BAG-DELETED');
            return interaction.reply({ embeds: [bagMsg] });
          } catch (error) {
            console.log(`/清空背包 錯誤: ${error}`);
          }
          break;
      }
    } catch (error) {
      console.log(`/商店 有錯誤 ${error}`);
      const errorCode = new EmbedBuilder()
      .setColor('Red')
      .setTitle('<a:Animatederror:1086903258993406003>丨不好!出現了錯誤')
      .setDescription("如果不能排除，請通知給作者!:") 
      .addFields({name: `錯誤訊息:`, value: "```"+`${error}`+"```"})
      .setTimestamp()  
      return interaction.reply({embeds: [errorCode]})
    }
} 