const fs = require('fs');
let walletIds = require('../config/wallet-ids.json').walletIds;
const { hasAvailableDispensers, getWalletData } = require('./utils.js');

// Place dispeners ids in here or in the config/wallet-ids.json file
const WALLET_IDS = [

];

// Using IIFE for now, but will probably refactor into a more portable api
(async () => {
	// Check to see if wallet ids are in seperate file, if not then
	// check the in file array (WALLET_IDS)
	walletIds = walletIds.length ? walletIds : WALLET_IDS;

	if (walletIds.length === 0) {
		console.log('Please add some wallet IDs to the config/wallet-ids.json config file');
		return
	}

	const walletPromises = await walletIds.map((wallet) => {
		return getWalletData(wallet);
	});

	Promise.all(walletPromises).then((wallets) => {
		const flattendDispenserArray = [];
		// Iterate over each wallet
		wallets.forEach((wallet) => {
			if(hasAvailableDispensers(wallet)) {
				console.log(`Available Wallets: ${wallet.id}`);
			}
			
			wallet.data.forEach((dispenser) => {
				// Push only open dispenser into array
				if (dispenser.status === '0') {
					flattendDispenserArray.push(dispenser);
				}
			})
		})

		// Read file to reference the values from the previous time this scriprt ran.
		// This is in leu of a database
		fs.readFile('scripts/data/data.json', 'utf8', function(err, fileData) {
			if (fileData) {
				const soldDispensers = JSON.parse(fileData).filter((data) => {
					// Find dispenser based on current index 
					const indexedDispenser = flattendDispenserArray.find((dispenser) => dispenser.source === data.source);
					return !!indexedDispenser && indexedDispenser.give_remaining !== data.give_remaining;
				});

				if (soldDispensers.length) {
					soldDispensers.forEach((dispenser) => {
						console.log('======================================');
						console.log(`Asset sold: ${dispenser.asset}`);
						console.log(`Dispenser address: ${dispenser.source}`);
						console.log(`Remaining: ${dispenser.give_remaining}`);
						console.log(`Amount (BTC): ${dispenser.satoshirate}`);
						console.log('======================================');
					})
				} else {
					console.log('No sales :(');
				}
			} else {
				// If there is no data in file, write server response for future reference
				fs.writeFile('scripts/data/data.json', JSON.stringify(flattendDispenserArray), () => {
					console.log('New data created');
				})
			}
		})
	}).catch((e) => {
		console.log(e)
	})
})();
