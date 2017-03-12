'use strict';

var _ = require('lodash');
var async = require('async');
var Common = require('./common');

function UtilsController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

UtilsController.prototype.estimateFee = function(req, res) {
  var self = this;
  var args = req.query.nbBlocks || '2';
  var nbBlocks = args.split(',');

  async.map(nbBlocks, function(n, next) {
    var num = parseInt(n);
    // Insight and Bitcoin JSON-RPC return bitcoin for this value (instead of satoshis).
    self.node.services.bitcoind.estimateFee(num, function(err, fee) {
      if (err) {
        return next(err);
      }
      next(null, [num, fee]);
    });
  }, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp(_.zipObject(result));
  });

};

UtilsController.prototype.mnbroadcast = function(req, res) {
  console.log("in mnbroadcast");
  var self = this;
  var mode = req.params.mode;
  var mnb_hex = req.body.mnb_hex;
  console.log(mode, mnb_hex);
  this.node.services.bitcoind.mnbroadcast(mode, mnb_hex, function(err, result) {
      if(err) {
        // TODO handle specific errors
        return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
}


module.exports = UtilsController;
