const fs = require("fs");

// module.exports.nikolaSaNasra = function () {
//     let wallets_object = JSON.parse(fs.readFileSync("wallets.json"));
//     let satoshi_balance = wallets_object["satoshi"].balance;
//     let new_satoshi_balance = parseInt(satoshi_balance) + parseInt(1000);
//     wallets_object["satoshi"] = {
//       owner: "satoshi",
//       balance: new_satoshi_balance
//     }

//     let data = JSON.stringify(wallets_object, null, 4);
//     fs.writeFile("./wallets.json",data , err => {
//       if(err) console.log('btuh');
//     });
//   };

function staking_multiplier_function (percentage) {
  return 0.8/(percentage + 0.01);
}

function staking_win_lose (percentage) {
  return Math.random() < percentage ? true : false;
}

module.exports = {
  staking_multiplier_function,
  staking_win_lose
}