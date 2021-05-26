const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async (bot,  message, args) => {
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
    let satoshi_balance = parseInt(wallets_object["satoshi"].balance);
    let numberofwallets = Object.keys(wallets_object).length - 1;
    let coin_to_give = satoshi_balance / numberofwallets;

    Object.keys(wallets_object).filter(wallet => wallet != "satoshi").forEach(walletid => {
        let old_balance = wallets_object[walletid].balance;
        let new_balance = parseInt(old_balance) + parseInt(coin_to_give)

        wallets_object[walletid] = {
            owner: wallets_object[walletid].owner,
            balance: new_balance
        }
    });

    wallets_object["satoshi"] = {
        owner: "satoshi",
        balance: 0
    }

    var data = JSON.stringify(wallets_object, null, 4);
    fs.writeFile("./wallets.json",data , err => {
      if(err) message.channel.send('mi ne stana');
      message.channel.send('satoshi e carvnat i veche nqma kokita dokato ne sa  pak');
    });
}

module.exports.help = {
  name: "$"
}
