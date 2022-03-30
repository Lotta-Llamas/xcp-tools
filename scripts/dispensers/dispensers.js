const https = require('https');
const fs = require('fs');
const { getWallets } = require('../config/wallet-ids.js');
const { hasAvailableDispensers } = require('./utils.js');

// Place dispeners ids in here or in the wallet-ids.js file
const WALLET_IDS = [

];

function getWalletData(walletId) {
	const options = {
		hostname: 'xchain.io',
		path: `/api/dispensers/${walletId}`,
		method: 'GET'
	}
	return new Promise((resolve, reject) => {
		// Using native node module, but will consider different libs after abstraction
		const req = https.get(options, res => {
			let dispensers = '';
			
			// called when a data chunk is received.
			res.on('data', (chunk) => {
				dispensers += chunk;
			});
	
			res.on('end', () => {	
				const wallet = JSON.parse(dispensers);
				// Append wallet id to response
				wallet.id = walletId;
				resolve(wallet);
			});
		});

		req.on('error', error => {
			console.log(error);
			reject(error);
		});
	
		req.end();
	})
}

// Using IIFE for now, but will probably refactor into a more portable api
(async () => {
	// Check to see if wallet ids are in seperate file, if not then
	// check the in file array (WALLET_IDS)
	const walletIds = getWallets().length ? getWallets() : WALLET_IDS;
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
					return indexedDispenser.give_remaining !== data.give_remaining;
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
