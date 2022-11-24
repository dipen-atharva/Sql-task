const environment = process.env.ENVIRONMENT || 'development'

const { source, destination } = require('../config/knexfile');

module.exports = {
  sourceKnex: require('knex')(source[environment]),
  destKnex: require('knex')(destination[environment]),
};
