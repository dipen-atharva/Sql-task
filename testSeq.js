require('dotenv').config()

/* PATCH :
  - Using Sequalize for storing date time in postgre
  - Overriding datatype parsing using setTypeParser (https://github.com/brianc/node-postgres/issues/429)
  - Time stored as expected in postgre with zoneless field
  - If timestamptz in post gre than +0530 will be added
*/

var types = require('pg').types;
types.setTypeParser(1114, function(stringValue) {
  // console.log(stringValue,"+++++++++", stringValue + "+0000")
  return new Date(Date.parse(stringValue ))
})
types.setTypeParser(1182, function(stringValue) {
  // console.log(stringValue,"+++++++++", stringValue + "+0000")
  return new Date(Date.parse(stringValue ))
})

const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize('sql2postgre', 'test', 'test', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});
const User = sequelize.define('user', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  },
  created_At :{
    type : DataTypes.TIME
  },
  updated_At :{
    type : DataTypes.TIME
  }
});
const firstName = 'Roger'
const lastName = 'Sharma'
const created_At = new Date('2022-10-10 12:00:00+05:30').toISOString()
const updated_At = new Date('2022-10-10 05:00:00+00:00').toISOString()
console.log(created_At ,"+++++++++++", updated_At)

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
