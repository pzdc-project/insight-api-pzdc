var _ = require('lodash');

module.exports.id = 'Cryptsy-USD';
module.exports.url = 'https://api.cryptsy.com/api/v2/markets/213';

module.exports.parseFn = function(raw) {
  return [{
    code: 'USD',
    rate: parseFloat(raw.data.last_trade.price)
  }];
};
