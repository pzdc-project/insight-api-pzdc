'use strict';

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var rootPath = path.normalize(__dirname + '/..'),
  env,
  db,
  port,
  b_port,
  p2p_port;

var packageStr = fs.readFileSync(rootPath + '/package.json');
var version = JSON.parse(packageStr).version;


function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var home = process.env.INSIGHT_DB || (getUserHome() + '/.insight');

if (process.env.INSIGHT_NETWORK === 'livenet') {
  env = 'livenet';
  db = home;
  port = '21213';
  b_port = '21212';
  p2p_port = '21212';
} else {
  env = 'testnet';
  db = home + '/testnet';
  port = '21113';
  b_port = '21112';
  p2p_port = '21112';
}
port = parseInt(process.env.INSIGHT_PORT) || port;


switch (process.env.NODE_ENV) {
  case 'production':
    env += '';
    break;
  case 'test':
    env += ' - test environment';
    break;
  default:
    env += ' - development';
    break;
}

var network = process.env.INSIGHT_NETWORK || 'testnet';
var forceRPCsync = process.env.INSIGHT_FORCE_RPC_SYNC;

var dataDir = process.env.PZDCD_DATADIR;
var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var isLinux = /^linux/.test(process.platform);
if (!dataDir) {
  if (isWin) dataDir = '%APPDATA%\\pzdc\\';
  if (isMac) dataDir = process.env.HOME + '/Library/Application Support/pzdc/';
  if (isLinux) dataDir = process.env.HOME + '/.pzdc/';
}
dataDir += network === 'testnet' ? 'testnet4' : '';

var safeConfirmations = process.env.INSIGHT_SAFE_CONFIRMATIONS || 6;
var ignoreCache = process.env.INSIGHT_IGNORE_CACHE || 0;


var pzdcdConf = {
  protocol: process.env.PZDCD_PROTO || 'http',
  user: process.env.PZDCD_USER || 'user',
  pass: process.env.PZDCD_PASS || 'pass',
  host: process.env.PZDCD_HOST || '127.0.0.1',
  port: process.env.PZDCD_PORT || b_port,
  p2pPort: process.env.PZDCD_P2P_PORT || p2p_port,
  p2pHost: process.env.PZDCD_P2P_HOST || process.env.PZDCD_HOST || '127.0.0.1',
  dataDir: dataDir,
  // DO NOT CHANGE THIS!
  disableAgent: true
};

var enableRatelimiter = process.env.ENABLE_RATELIMITER === 'true';
var enableEmailstore = process.env.ENABLE_EMAILSTORE === 'true';
var loggerLevel = process.env.LOGGER_LEVEL || 'info';
var enableHTTPS = process.env.ENABLE_HTTPS === 'true';
var enableCurrencyRates = process.env.ENABLE_CURRENCYRATES === 'true';

if (!fs.existsSync(db)) {
  mkdirp.sync(db);
}

module.exports = {
  enableRatelimiter: enableRatelimiter,
  ratelimiter: require('../plugins/config-ratelimiter.js'),
  enableEmailstore: enableEmailstore,
  enableCurrencyRates: enableCurrencyRates,
  currencyrates: require('../plugins/config-currencyrates'),
  loggerLevel: loggerLevel,
  enableHTTPS: enableHTTPS,
  version: version,
  root: rootPath,
  publicPath: process.env.INSIGHT_PUBLIC_PATH || false,
  appName: 'Insight ' + env,
  apiPrefix: '/api',
  port: port,
  leveldb: db,
  pzdcd: pzdcdConf,
  network: network,
  disableP2pSync: false,
  disableHistoricSync: false,
  poolMatchFile: rootPath + '/etc/minersPoolStrings.json',

  // Time to refresh the currency rate. In minutes
  currencyRefresh: 10,
  keys: {
    segmentio: process.env.INSIGHT_SEGMENTIO_KEY
  },
  safeConfirmations: safeConfirmations, // PLEASE NOTE THAT *FULL RESYNC* IS NEEDED TO CHANGE safeConfirmations
  ignoreCache: ignoreCache,
  forceRPCsync: forceRPCsync,
};
