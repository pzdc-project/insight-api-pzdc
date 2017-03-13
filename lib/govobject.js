'use strict';

var Common = require('./common');

function GovObjectController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

GovObjectController.prototype.voteRaw = function(req, res) {  //!!!
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

GovObjectController.prototype.govObjectList = function(options, callback) {
    this.node.services.bitcoind.govObjectList(options, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });

};


GovObjectController.prototype.show = function(req, res) {
    var self = this;
    var options = {};

    this.getHash(req.hash, function(err, data) {
        if(err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data);
    });

};

GovObjectController.prototype.getHash = function(hash, callback) {

    this.node.services.bitcoind.govObjectHash(hash, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });

};



/**
 * Verifies that the GovObject Hash provided is valid.
 *
 * @param req
 * @param res
 * @param next
 */
GovObjectController.prototype.checkHash = function(req, res, next) {
    req.hash = req.params.hash;
    this.check(req, res, next, [req.hash]);

};

GovObjectController.prototype.check = function(req, res, next, hash) {
    // TODO: Implement some type of validation

    if(hash) next();

};




module.exports = GovObjectController;
