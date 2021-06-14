const Discord = require("discord.js");
const tailcat = require('tailcat');

let wallets_file_tail = new tailcat.TailCat('./wallets.json');

module.exports.run = async (bot,  message, args) => {
  message.channel.send(wallets_file_tail);
}

module.exports.help = {
  name: "info"
}
