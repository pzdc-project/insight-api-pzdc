'use strict';

var Common = require('./common');

function GovObjectController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

GovObjectController.prototype.list = function(req, res) {
  var options = {};
  if (req.params.filter) {
      if (req.params.filter == 'proposal') options.type = 1;
      if (req.params.filter == 'trigger') options.type = 2;
  }

  this.govObjectList(options, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(result);
  });

};

GovObjectController.prototype.govObjectList = function(options, callback) {
    this.node.services.bitcoind.govObjectList(options, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });

};


module.exports = GovObjectController;
