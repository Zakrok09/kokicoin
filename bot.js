  const botconfig = require('./botconfig.json');
  const Discord = require("discord.js");
  const fs = require("fs");


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

  

  bot.login(botconfig.token);

  
  bot.setInterval(function() {
    let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));

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

      // let old_taxes = wallets_object["genesis"].balance;
      // if (old_taxes > 1) {
      //   let taxxed_payer_balance = parseInt(new_payer_balance) + parseInt(1);
      //   let new_taxes = parseInt(old_taxes) - parseInt(1);

      //   wallets_object[trans.payer.id] = {
      //     owner: trans.payer.username,
      //     balance: taxxed_payer_balance
      //   }

      //   wallets_object["genesis"] = {
      //     owner: "taxes",
      //     balance: new_taxes
      //   }
      // }
      
      var data = JSON.stringify(wallets_object, null, 4);
        fs.writeFile("./wallets.json",data , err => {
        if(err) console.log(err);;
      });
 
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