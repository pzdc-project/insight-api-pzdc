'use strict';

var Common = require('./common');

function GovObjectController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

GovObjectController.prototype.list = function(req, res) {

  // TODO - improve handler

  this.govObjectList(function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });

};

GovObjectController.prototype.govObjectList = function(callback) {

  this.node.services.bitcoind.govObjectList(function(err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });

};


module.exports = GovObjectController;
