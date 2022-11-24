require('dotenv').config({ path: '../.env' })
const environment = process.env.ENVIRONMENT || 'development'
const { destination } = require('./knexfile');

module.exports = destination[environment];
