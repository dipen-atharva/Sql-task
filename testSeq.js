require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
// const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sql2postgre', 'test', 'test', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  // dialectOptions: {
  //   useUTC: false, // for reading from database
  // },
  // timezone: '+00:00'
});
const User = sequelize.define('user', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  created_At :{
    type : DataTypes.TIME
  },
  updated_At :{
    type : DataTypes.TIME
  }
}, {
  // Other model options go here
});
const firstName = 'Roger'
const lastName = 'Sharma'
const created_At = new Date('2022-10-10 12:00:00+05:30').toISOString()
const updated_At = new Date('2022-10-10 12:00:00+05:30').toISOString()

const insert = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const result = await User.create({ firstName, lastName,created_At,updated_At }) 
    console.log(result)

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const run = async () => {
  try {
    await insert()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
};

run();
