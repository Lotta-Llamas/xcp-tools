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
