const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = async (bot,  message, args) => {
    let wallets_object_preloaded = JSON.parse(fs.readFileSync("wallets.json"));
    let nonexisting_wallet_embed = new Discord.MessageEmbed().setColor('#B8E9DE').setTitle('nqmash wallet we manqk').setDescription(`napravi si s **$newwallet**`)
    if (!wallets_object_preloaded[message.author.id]) return message.channel.send(nonexisting_wallet_embed);

    if (!args[0]) return message.channel.send("I kvo da napravq po tochno?");

    if (args[0] === "disc" || args[0] === "disconnect") {
        let invalid_input_embed = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('nevaliden input, pomqr').setAuthor('Kokicoin botkata').setDescription('znachi sq, pishesh $wallet disc [choveka s tag].').addFields({name: 'Ne moje da kiknesh sebe si', value: 'we tupanar'}, {name: 'sushto ne moje da go disc ako ne govori'});

        if (!args[1]) return message.channel.send(invalid_input_embed);
        let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
        
        let user = message.author;
        let victim = message.guild.member(message.mentions.users.first()) || args[1];
        
        let no_money = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Nqmash 5 kokita').addField(`${message.author.username}, v momenta imash`, `${wallets_object[message.author.id].balance}`).setAuthor('Kokicoin botkata');
        let no_wallet = new Discord.MessageEmbed().setColor('#F05C5C').setTitle('Manqka nqma wallet i ne e sub na servisite na kokicoin bot TM').setDescription("Moje da si napravi s **$newwallet**").setAuthor('Kokicoin botkata');

        if (!wallets_object[victim.id]) return message.channel.send(no_wallet);
        if (user.id === victim.id) return message.channel.send(invalid_input_embed);

        if (wallets_object[user.id].balance < 5) return message.channel.send(no_money);

        if (victim.voice.channelID === null) return message.channel.send(invalid_input_embed);
        try {
            victim.voice.kick();
        } catch (error) {
            return message.channel.send("mi ne stana");
        }

        
        let old_user_balance = wallets_object[user.id].balance;
        let old_victim_balance = wallets_object[victim.id].balance;
        let new_user_balance = old_user_balance - 5;
        let new_victim_balance = parseInt(old_victim_balance) + parseInt(5);

        wallets_object[user.id] = {
            owner: user.username,
            balance: new_user_balance
        }
        
        wallets_object[victim.id] = {
            owner: victim.user.username,
            balance: new_victim_balance
        }

        var data = JSON.stringify(wallets_object, null, 4);
        fs.writeFile("./wallets.json",data , err => {
        if(err) console.log(err);;
        });

        let transaction_embed = new Discord.MessageEmbed().setColor('#3BB9EB').setTitle('Disconecta e gotov').setDescription(`Shte se izpulni na block: ${bot.block + 1}`).addField(`Tranzakciqta e:`,`[${user.username}] -> [${victim.user.username}] za 5 kokicoina`).setAuthor('Kokicoin botkata')
        message.channel.send(transaction_embed);
    } else if (args[0] === "help") {
        message.channel.send("disconekta struva 5 kokicoina");
    }
}

module.exports.help = {
  name: "service"
}
