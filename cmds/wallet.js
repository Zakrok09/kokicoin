const Discord = require('discord.js');
const fs = require('fs');
const helpers = require('../functions.js')


module.exports.run = async (bot,  message, args) => {
  let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
  let nonexisting_wallet_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('nqmash wallet we manqk').setDescription(`napravi si s **$newwallet**`)
  if (!wallets_object[message.author.id]) return message.channel.send(nonexisting_wallet_embed);
  let invalid_input_embed = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('nevaliden input, pomqr').setAuthor('Kokicoin botkata').setDescription('znachi sq, pishesh $wallet send [choveka s tag] [kolko para].').addFields({name: 'Ne moje vmesto chislo da napishesh domati', value: '$wallet send @nikola **domati** -> ne stava bratan'}, {name: 'Ne moje da napishesh chislo po-malko ili ravno na 0 i sushto da pratish na sebe si', value: 'we tupanar'});
  if (!args[0]) return message.channel.send('stiga spami retard');
  
  let no_money = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Nqmash tolkova').addField(`${message.author.username}, v momenta imash`, `${wallets_object[message.author.id].balance}`).setAuthor('Kokicoin botkata');

  if (args[0] === "send") {
    
    if(!args[1]) return message.channel.send(invalid_input_embed);
    if(!args[2]) return message.channel.send(invalid_input_embed);

    let amount = args[2];
    let payer = message.author;
    let payee = message.guild.member(message.mentions.users.first()) || args[1];

    let no_wallet = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Manqka nqma wallet').setDescription("Moje da si napravi s **$newwallet**").setAuthor('Kokicoin botkata');

    if (isNaN(amount)) return message.channel.send(invalid_input_embed);
    if (amount <= 0 ) return message.channel.send(invalid_input_embed)
    if (payee.id === payer.id) return message.channel.send(invalid_input_embed);
    if (wallets_object[payer.id].balance <  amount) return message.channel.send(no_money);
    if (!wallets_object[payee.id]) return message.channel.send(no_wallet);
    
    let transaction_embed = new Discord.MessageEmbed().setColor('#3BB9EB').setTitle('Tranzakciq e gotova').setDescription(`Shte se izpulni na block: ${bot.block + 1}`).addField(`Tranzakciqta e:`,`[${payer.username}] -> [${payee.user.username}] (${amount})`).setAuthor('Kokicoin botkata').setAuthor('Kokicoin botkata');

    bot.addTransaction(amount, payer, payee);
    message.channel.send(transaction_embed);
    
  } else if (args[0] === 'balance' || args[0] === "bal") {   
    
    let mentioned = message.guild.member(message.mentions.users.first());
    let user = mentioned ? mentioned.user : message.author;

    let wallet_embed = new Discord.MessageEmbed().setColor('#D3E7C1').setTitle('Kokicoin banka').addField(`${user.username}, taka brat.`, `Tozi kelesh ima:  ${wallets_object[user.id].balance} kokicoin`).setThumbnail(user.avatarURL());

    message.channel.send(wallet_embed);
    
  } else if (args[0] === "stake") {
    invalid_input_embed = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('nevaliden input, pomqr').setAuthor('Kokicoin botkata').setDescription('znachi sq, pishesh $wallet stake [kolko steikvash] [procenta < 40% ].').addFields({name: 'trqbva amaaunta da e v cifri', value: '$wallet stake 10domata 25% <- ne stava'}, {name: 'ne moje <= 0', value: '$wallet stake -10 10% <- ne stava'});
    if(!args[1]) return message.channel.send(invalid_input_embed);
    if(!args[2]) return message.channel.send(invalid_input_embed);

    let amount = args[1];
    let staker = message.author;
    let taxes = "genesis";
    

    if (isNaN(amount)) return message.channel.send(invalid_input_embed);
    if (amount <= 0 ) return message.channel.send(invalid_input_embed)

    if (wallets_object[staker.id].balance <  amount) return message.channel.send(no_money);
    

    let percentage = args[2].split('');
    if (percentage[percentage.length - 1] === "%") percentage.pop();
    let clean_percentage = percentage.join('')/100;

    let staked_amount = Math.round(helpers.staking_multiplier_function(clean_percentage)) * amount; 
    let max_stake = Math.round((wallets_object[taxes].balance-10)/helpers.staking_multiplier_function(clean_percentage));
    if (clean_percentage > 0.4) return message.channel.send("e brat oshte malko 100% li iskash");

    let no_money_kazino = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Kazinoto e broke nqma staking').setDescription(`V kazinoto ima ${wallets_object["genesis"].balance}. S tozi procent (${clean_percentage}) ti mojesh da stakenesh max ${max_stake}`).setAuthor('Kokicoin botkata');
    if (max_stake < amount) return message.channel.send(no_money_kazino);
    
    if (helpers.staking_win_lose(clean_percentage)) {
      
      let transaction = {
        amount: staked_amount,
        payer: taxes,
        payee: staker
      }

      bot.wonstaking.push(transaction);
      let result = new Discord.MessageEmbed().setColor('#12CCAB').setTitle('🌟SPECHELI WEEE🌟').addField(`Taka drugar, speche li si: ${staked_amount}`, `Idvat na sledvashtiq block: ${bot.block + 1}`)
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

  } else if (args[0] === "taxes") {
    
    let taxes_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('Taxite (farmable) parite sa:').setDescription(`${wallets_object["genesis"].balance} kokicoina.`)
    message.channel.send(taxes_embed);
  } else if (args[0] === "whales") {
    
    let whales = Object.keys(wallets_object).filter(wallet => wallet != "satoshi").sort((a,b) => wallets_object[b].balance - wallets_object[a].balance);
    let leaderboard = "";
    let position = 1;
    whales.forEach(wallet => {
      leaderboard = leaderboard + `\n${position}. ${wallets_object[wallet].owner} - **${wallets_object[wallet].balance}** kokicoin`;
      position++;
    });
    let whales_board_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('Walletite podredeni po-golemina:').setDescription(`${leaderboard}`)
    return message.channel.send(whales_board_embed);
  } else if (args[0] === "delete") {
    let confirmation_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('VNIMAVAI, SHTE SI IZTRIESH WALETA').setDescription(`ako reaktnesh s like shte se iztrie walleta i parite ti shte otidat v taxes`).addField('imash 15 sekundi da pomislish', 'ako nqkoi drug retard reactne nqma da stane nishto, spoko');
    let deconfirmed_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('svurshi ti vremeto za izbor').setDescription(`ami mai sa nasra, nqma nikvi promeni sq`);
    message.channel.send(confirmation_embed).then(msg => {
      msg.react('✅');
      msg.react('❌')

      let approve_filer = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
      msg.awaitReactions(approve_filer, { time: 15000 }).then(collected => {
        if (collected.size === 0) {
          msg.edit(deconfirmed_embed);
          msg.reactions.removeAll().catch(err => message.channel.send(`Emi brat daje ne moga da triq reakcii: \n ${err}`));
        } else {
          message.channel.send('emi sorry bratan triq go');

          let amount = wallets_object[message.author.id].balance;
          let old_payer_balance = wallets_object[message.author.id].balance;
          let old_payee_balance = wallets_object["genesis"].balance;
          let new_payer_balance = old_payer_balance - amount;
          let new_payee_balance = parseInt(old_payee_balance) + parseInt(amount);

          wallets_object[message.author.id] = {
              owner: message.author.username,
              balance: new_payer_balance
          }
          
          wallets_object["genesis"] = {
              owner: "taxes",
              balance: new_payee_balance
          }

          delete wallets_object[message.author.id];
          var data = JSON.stringify(wallets_object, null, 4);
            fs.writeFile("./wallets.json",data , err => {
            if(err) {};
          });
        }
      });
    })
  } else if (args[0] === "trans") {
    let transaction_array = JSON.parse(fs.readFileSync("transactions.json"));
    
    let transes = transaction_array.transactions.sort((a,b) => b._number - a._number)
    let transactions = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('Poslednite 1-5 transactii sa: ');
    if (!transes[1]) {
      transactions.setDescription('||nikakvi||');
      return message.channel.send(transactions);
    }
    for(let x in transes) {
      transactions.addField(`No.${transes[x]._number} - ${transes[x]._payer} to ${transes[x]._payee}`, `||Manqkat e dal celi ${transes[x]._amount} kokicoina na ${transes[x]._payee}||`);
      if (x === "4") break;
    }
    message.channel.send(transactions);
  } else if (args[0] === "total") {
    let balance_array = Object.keys(wallets_object).map(key => [wallets_object[key].balance]);
    let total_kokicoin = 0;
    for (let x of balance_array) {
      total_kokicoin += Number(x);
    }
    let total_kokicoin_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('💵 OBSHTO IMA 💵').addField('kokicoin bot', `** ${total_kokicoin} ** kokicoina koeto e mojebi ${total_kokicoin / 1000} nasiraniq na nikola`);
    message.channel.send(total_kokicoin_embed);

  } else if (args[0] === "donate") {
    invalid_input_embed = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('nevaliden input, pomqr').setAuthor('Kokicoin botkata').setDescription('znachi sq, pishesh $wallet donate [kolko donatevash].').addFields({name: 'trqbva amaaunta da e v cifri', value: '$wallet donate deset <- ne stava'}, {name: 'ne moje <= 0', value: '$wallet donate -10 <- ne stava'});
    if(!args[1]) return message.channel.send(invalid_input_embed);
    if(args[1] === "laino") return message.channel.send("az shte ti dam laino v ostata ");

    let amount = args[1];
    let donator = message.author;
    let taxes = "genesis";

    if (isNaN(amount)) return message.channel.send(invalid_input_embed);
    if (amount <= 0 ) return message.channel.send(invalid_input_embed)

    if (wallets_object[donator.id].balance <  amount) return message.channel.send(no_money);

    let transaction = {
      amount: amount,
      payer: donator,
      payee: taxes
    }

    bot.loststaking.push(transaction);
    let result = new Discord.MessageEmbed().setColor('#12CCAB').setTitle('👏 EVALATA !! ').addField(`Taka drugar, ti si mega qkiq i doneitna: ${amount} na banmkata`, `Shte stignat na sledvashtiq block: ${bot.block + 1}`)
    return message.channel.send(result);
  }

  
}

module.exports.help = {
  name: "wallet"
}
