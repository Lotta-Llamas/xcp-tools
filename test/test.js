const assert = require('assert');
const nock = require('nock');
const { describe, it } = require("mocha");

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
});