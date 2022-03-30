const https = require('https');

exports.hasAvailableDispensers = (dispensers) => {
	try {
		if (!dispensers || !dispensers.data || dispensers.data.length === 0) {
			throw 'No dispensers in this wallet'
		}
		// Filter to get all closed dispensers
		const closedDispensers = dispensers.data.filter((dispenser) => { 
			return dispenser.status === '10' 
		});

		// If there are any wallets that are all closed dispensers or that are new
		// then log out those wallet ids.  
		if (closedDispensers.length === dispensers.data.length || dispensers.data.length === 0) {
			return true;
		}
		return false;
	} catch (e) {
		// Fail with crace, but still log error.
		console.log(`Error: ${e}`);
		return false;
	}
}

exports.getWalletData = (walletId) => {
	if (!walletId || typeof walletId !== 'string' ) {
		return Error('Wallet ID is not a string')
	}
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