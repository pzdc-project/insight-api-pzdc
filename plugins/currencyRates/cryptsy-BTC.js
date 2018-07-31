var _ = require('lodash');

module.exports.id = 'Cryptsy-BTC';
module.exports.url = 'https://api.cryptsy.com/api/v2/markets/155';

module.exports.parseFn = function(raw) {
  return [{
    code: 'BTC',
    rate: parseFloat(raw.data.last_trade.price)
  }];
};
