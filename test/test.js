const assert = require('assert');
const { describe, it } = require("mocha");
const { hasAvailableDispensers } = require('../scripts/dispensers/utils.js');

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