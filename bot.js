  const botconfig = require('./botconfig.json');
  const Discord = require("discord.js");
  const fs = require("fs");
  const tailcat = require('tailcat');

  let wallets_file_tail = new tailcat.TailCat('./wallets.json');


  var servers = {};

  const bot = new Discord.Client({
    disableEveryone: true
  });
  bot.commands = new Discord.Collection();
  bot.wallets = require("./wallets.json");
  bot.transactions = [];
  bot.wonstaking = [];
  bot.loststaking = [];
  bot.block = 0;
  bot.hash = 0;
  /**
   * @param  {} amount The amount of Kokicoin to be sent
   * @param  {} payer The one who sends the Kokicoin
   * @param  {} payee The one who recieves the Kokicoin
   */
  bot.addTransaction = function (amount, payer, payee) {
    let transaction = {
      amount,
      payer,
      payee
    }

    bot.transactions.push(transaction);
  }
  
  //Commands

  fs.readdir("./cmds/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
      console.log("No commands!!!!!!");
      return;
    }

    console.log(`Loading ${jsfiles.length} commands...`);

    jsfiles.forEach((f, i) => {
      let props = require(`./cmds/${f}`)
      console.log(`${i + 1}: ${f} loaded!`);
      bot.commands.set(props.help.name, props);
    });
  });

  //Botonready

  bot.on("ready", async () => {
    try {
      let link = await bot.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
    } catch (e) {
      console.log(e.stack);
    }
    await bot.generateInvite("ADMINISTRATOR").then(link => {
      console.log(link);
    });


    console.log(`Bot initialized - ${bot.user.username}`);


    


  //Message delivered
  bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let prefix = botconfig.prefix;

    if (!message.content.startsWith(prefix)) return;
    
    let messageArray = message.content.split(/ +/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);
    let cmd = bot.commands.get(command.slice(prefix.length));

    if (command.startsWith(prefix)) { 
      if (cmd) cmd.run(bot, message, args); 
      console.log(`Kokicoin: ${message.author.username}#${message.author.discriminator} used command '${command}' on ${message.guild.name}`);
    }

    });
  });

  
  let trans_num = 1;
  bot.login(botconfig.token);

  fs.writeFile('./transactions.json', '{"transactions": []}', function(){console.log('Transactions cleared!')})

  bot.setInterval(function() {
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
    let transaction_array = JSON.parse(fs.readFileSync("transactions.json"));

    bot.transactions.forEach(trans => {
      let old_payer_balance = wallets_object[trans.payer.id].balance;
      let old_payee_balance = wallets_object[trans.payee.id].balance;
      let new_payer_balance = old_payer_balance - trans.amount;
      let new_payee_balance = parseInt(old_payee_balance) + parseInt(trans.amount);

      wallets_object[trans.payer.id] = {
          owner: trans.payer.username,
          balance: new_payer_balance
      }
      
      wallets_object[trans.payee.id] = {
          owner: trans.payee.user.username,
          balance: new_payee_balance
      }

      
      let clean_trans = {
        _number: trans_num,
        _amount: trans.amount,
        _payer: trans.payer.username,
        _payee: trans.payee.user.username
      }
      trans_num++;
      transaction_array.transactions.push(clean_trans);

    });
    
    var trans_data = JSON.stringify(transaction_array, null, 4)
      fs.writeFile("transactions.json", trans_data, err => {
        if(err) console.log(err);
      })
      
      var data = JSON.stringify(wallets_object, null, 4);
        fs.writeFile("./wallets.json",data , err => {
        if(err) console.log(err);
      });

    bot.transactions = [];

    bot.loststaking.forEach(trans => {
      let old_payer_balance = wallets_object[trans.payer.id].balance;
      let old_payee_balance = wallets_object[trans.payee].balance;
      let new_payer_balance = old_payer_balance - trans.amount;
      let new_payee_balance = parseInt(old_payee_balance) + parseInt(trans.amount);

      wallets_object[trans.payer.id] = {
          owner: trans.payer.username,
          balance: new_payer_balance
      }
      
      wallets_object[trans.payee] = {
          owner: "taxes",
          balance: new_payee_balance
      }

      var data = JSON.stringify(wallets_object, null, 4);
        fs.writeFile("./wallets.json",data , err => {
        if(err) console.log(err);;
      });
 
    });

    bot.loststaking = [];

    bot.wonstaking.forEach(trans => {
      let old_payer_balance = wallets_object[trans.payer].balance;
      let old_payee_balance = wallets_object[trans.payee.id].balance;
      let new_payer_balance = old_payer_balance - trans.amount;
      let new_payee_balance = parseInt(old_payee_balance) + parseInt(trans.amount);

      wallets_object[trans.payer] = {
          owner: "taxes",
          balance: new_payer_balance
      }
      
      wallets_object[trans.payee.id] = {
          owner: trans.payee.username,
          balance: new_payee_balance
      }

      var data = JSON.stringify(wallets_object, null, 4);
        fs.writeFile("./wallets.json",data , err => {
        if(err) console.log(err);;
      });
 
    });

    bot.wonstaking = [];

    
    bot.block++;
    bot.user.setActivity(`block is ${bot.block} updates every 15 secs`);
  }, 15000)