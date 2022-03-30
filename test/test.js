const assert = require('assert');
const nock = require('nock');
const { describe, it } = require("mocha");
const { hasAvailableDispensers, getWalletData } = require('../scripts/dispensers/utils.js');

// Mock xchain.io/api/dispensers/{walletId} response
nock('https://xchain.io')
	.persist()
	.get('/api/dispensers/1')
	.reply(200, {
		id: 1,
		total: 1,
		data: [
			{
				"asset":"SMOLDONNA",
				"escrow_quantity":"4",
				"give_quantity":"1",
				"give_remaining":"0",
				"status":"10",
			}
		]
	})

// If a wallet has a status of 10 and have 0 gives_remaining
// its considered availabe
const available = {
	data: [{
		"asset":"SMOLDONNA",
		"escrow_quantity":"4",
		"give_quantity":"1",
		"give_remaining":"0",
		"status":"10",
	}]
}

// If a wallet has a status of 0 and have +1 gives_remaining
// its considered unavailabe
const unavailable = {
	data: [{
		"asset":"SMOLDONNA",
		"escrow_quantity":"4",
		"give_quantity":"1",
		"give_remaining":"1",
		"status":"0",
	}]
}

// Test Utils
describe('Utils', function () {
	describe('hasAvailableDispensers()', function () {
		it('should return true, indicating dispensers are available', function () {
			assert.equal(hasAvailableDispensers(available), true);
		});

		it('should return false, indicating dispensers are unavailable', function () {
			assert.equal(hasAvailableDispensers(unavailable), false);
		});

		it('should return false because no value was passed in (handled error)', function () {
			assert.equal(hasAvailableDispensers(), false);
		});
	});
	describe('getWalletData()', function () {
		it('should return wallet data', function () {
			getWalletData('1').then((response) => {
				assert.equal(response.id, 1);
				assert.equal(response.total, 1);
				assert.equal(response.data[0].asset, 'Asset Name');
				assert.equal(response.data[0].escrow_quantity, '4');
				assert.equal(response.data[0].give_quantity, '1');
				assert.equal(response.data[0].give_remaining, '4');
				assert.equal(response.data[0].status, '10');
			});
		});
		it('should error if wallet id is not present', function () {
			const borkedData = getWalletData()
			assert.equal(borkedData.name, 'Error');
			assert.equal(borkedData.message, 'Wallet ID is not a string');
		});
	});
});