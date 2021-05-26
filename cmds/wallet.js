const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot,  message, args) => {
  let wallets_object_preloaded = JSON.parse(fs.readFileSync("wallets.json"));
  let nonexisting_wallet_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('nqmash wallet we manqk').setDescription(`napravi si s **$newwallet**`)
  if (!wallets_object_preloaded[message.author.id]) return message.channel.send(nonexisting_wallet_embed);

  if (!args[0]) return message.channel.send('stiga spami retard');
  
  if (args[0] === "send") {
    let invalid_input_embed = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('nevaliden input, pomqr').setAuthor('Kokicoin botkata').setDescription('znachi sq, pishesh $wallet send [choveka s tag] [kolko para].').addFields({name: 'Ne moje vmesto chislo da napishesh domati', value: '$wallet send @nikola **domati** -> ne stava bratan'}, {name: 'Ne moje da napishesh chislo po-malko ili ravno na 0 i sushto da pratish na sebe si', value: 'we tupanar'});
    
    if(!args[1]) return message.channel.send(invalid_input_embed);
    if(!args[2]) return message.channel.send(invalid_input_embed);

    let amount = args[2];
    let payer = message.author;
    let payee = message.guild.member(message.mentions.users.first()) || args[1];
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));

    let no_money = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Nqmash tolkova').addField(`${message.author.username}, v momenta imash`, `${wallets_object[message.author.id].balance}`).setAuthor('Kokicoin botkata');
    let no_wallet = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Manqka nqma wallet').setDescription("Moje da si napravi s **$newwallet**").setAuthor('Kokicoin botkata');

    if (isNaN(amount)) return message.channel.send(invalid_input_embed);
    if (amount <= 0 ) return message.channel.send(invalid_input_embed)
    if (payee.id === payer.id) return message.channel.send(invalid_input_embed);
    if (wallets_object[payer.id].balance <  amount) return message.channel.send(no_money);
    if (!wallets_object[payee.id]) return message.channel.send(no_wallet);

    let transaction = {
      amount,
      payer,
      payee
    }
    
    let transaction_embed = new Discord.MessageEmbed().setColor('#3BB9EB').setTitle('Tranzakciq e gotova').setDescription(`Shte se izpulni na block: ${bot.block + 1}`).addField(`Tranzakciqta e:`,`[${payer.username}] -> [${payee.user.username}] (${amount})`).setAuthor('Kokicoin botkata').setAuthor('Kokicoin botkata');

    bot.transactions.push(transaction);
    message.channel.send(transaction_embed);
    
  } else if (args[0] === 'balance' || args[0] === "bal") {   
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
    let mentioned = message.guild.member(message.mentions.users.first());
    let user = mentioned ? mentioned.user : message.author;

    let wallet_embed = new Discord.MessageEmbed().setColor('#D3E7C1').setTitle('Kokicoin banka').addField(`${user.username}, taka brat.`, `Tozi kelesh ima:  ${wallets_object[user.id].balance} kokicoin`).setThumbnail(user.avatarURL());

    message.channel.send(wallet_embed);
    
  } else if (args[0] === "stake") {
    let invalid_input_embed = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('nevaliden input, pomqr').setAuthor('Kokicoin botkata').setDescription('znachi sq, pishesh $wallet stake [kolko steikvash] [procenta - 25% ili 10%].').addFields({name: 'trqbva amaaunta da e v cifri', value: '$wallet stake 10domata 25% <- ne stava'}, {name: 'ne moje <= 0', value: '$wallet stake -10 10% <- ne stava'});
    if(!args[1]) return message.channel.send(invalid_input_embed);
    if(!args[2]) return message.channel.send(invalid_input_embed);

    let amount = args[1];
    let staker = message.author;
    let taxes = "genesis";
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));

    if (isNaN(amount)) return message.channel.send(invalid_input_embed);
    if (amount <= 0 ) return message.channel.send(invalid_input_embed)

    let no_money = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Nqmash tolkova').addField(`${message.author.username}, v momenta imash`, `${wallets_object[staker.id].balance}`).setAuthor('Kokicoin botkata');
    let no_money_kazino = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Kazinoto e broke nqma staking').setDescription(`V kazinoto ima ${wallets_object["genesis"].balance}. Ti mojesh da stakenesh max ${wallets_object["genesis"].balance/4}`).setAuthor('Kokicoin botkata');

    if (wallets_object[staker.id].balance <  amount) return message.channel.send(no_money);
    if (wallets_object[taxes].balance < (amount * 4)) return message.channel.send(no_money_kazino);

    if (args[2] === "25%") {
      let random_number = Math.floor(Math.random() * 100);
      if (random_number < 25) {
        let transaction = {
          amount: amount * 2.5,
          payer: taxes,
          payee: staker
        }

        bot.wonstaking.push(transaction);
        let result = new Discord.MessageEmbed().setColor('#12CCAB').setTitle('🌟SPECHELI WEEE🌟').addField(`Taka drugar, speche li si: ${amount * 2.5}`, `Idvat na sledvashtiq block: ${bot.block + 1}`)
        return message.channel.send(result);
      } else {

        let transaction = {
          amount: amount,
          payer: staker,
          payee: taxes
        }

        bot.loststaking.push(transaction);
        let result = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('❌ JALKAR ZAGUBI ❌').addField(`Taka jalkar, zagubi si: ${amount}`, `Otivat si na sledvashtiq block: ${bot.block + 1}`)
        return message.channel.send(result);
      }
    } else if (args[2] === "10%") {
      let random_number = Math.floor(Math.random() * 100);
      if (random_number < 10) {
        let transaction = {
          amount: amount * 4,
          payer: taxes,
          payee: staker
        }

        bot.wonstaking.push(transaction);
        let result = new Discord.MessageEmbed().setColor('#12CCAB').setTitle('🌟SPECHELI WEEE🌟').addField(`Taka drugar, speche li si: ${amount * 4}`, `Idvat na sledvashtiq block: ${bot.block + 1}`)
        return message.channel.send(result);
      } else {

        let transaction = {
          amount: amount,
          payer: staker,
          payee: taxes
        }

        bot.loststaking.push(transaction);
        let result = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('❌ JALKAR ZAGUBI ❌').addField(`Taka jalkar, zagubi si: ${amount}`, `Otivat si na sledvashtiq block: ${bot.block + 1}`)
        return message.channel.send(result);
      }
    } else {
      return message.channel.send(invalid_input_embed);
    }
  } else if (args[0] === "taxes") {
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
    let taxes_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('Taxite (farmable) parite sa:').setDescription(`${wallets_object["genesis"].balance} kokicoina.`)
    message.channel.send(taxes_embed);
  } else if (args[0] === "whales") {
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
    let whales = Object.keys(wallets_object).filter(wallet => wallet != "satoshi").sort((a,b) => wallets_object[b].balance - wallets_object[a].balance);
    let leaderboard = "";
    let position = 1;
    whales.forEach(wallet => {
      leaderboard = leaderboard + `\n${position}. ${wallets_object[wallet].owner}`;
      position++;
    });
    return message.channel.send(leaderboard);
  } 
  

}

module.exports.help = {
  name: "wallet"
}
