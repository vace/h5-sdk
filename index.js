'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./sdk.js');
} else {
  module.exports = require('./sdk.dev.js');
}
