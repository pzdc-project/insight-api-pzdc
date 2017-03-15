'use strict';

var Common = require('./common');

function MNController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

MNController.prototype.voteRaw = function(req, res) {
  var self = this;
  this.node.services.bitcoind.voteraw(
    req.body,
    function(err, result) {
      if(err) {
        // TODO handle specific errors
        return self.common.handleErrors(err, result);
    }
        res.jsonp(result)
  });

};


MNController.prototype.mnbroadcast = function(req, res) {
  var self = this;
  var mode = req.params.mode;
  var mnb_hex = req.body.mnb_hex;
  this.node.services.bitcoind.mnbroadcast(mode, mnb_hex, function(err, result) {
      if(err) {
        // TODO handle specific errors
        return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
}


module.exports = MNController;
