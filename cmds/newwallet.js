const Discord = require('discord.js');
const fs = require('fs');
module.exports.run = async (bot,  message, args) => {

  
  var user = message.author;
  var wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
  
  let existing_wallet_response = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('Koki bankata kazva:').setDescription(`neshtastnik prost veche imash wallet`)

  if(wallets_object[user.id]) return message.channel.send(existing_wallet_response);
  wallets_object[user.id] = {
    owner: user.username,
    balance: 0
  }
  var data = JSON.stringify(wallets_object, null, 4);
  fs.writeFile("./wallets.json",data , err => {
    if(err) throw err;
    let new_wallet_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('Koki bankata kazva:').setDescription(`are chestito vlizai v bankata`)
    message.channel.send(new_wallet_embed);
  });

}

module.exports.help = {
  name: "newwallet"
}
