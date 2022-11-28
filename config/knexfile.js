module.exports = {
  source: {
    development: {
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'datadump',
        multipleStatements: true
      },
      migrations: {
        directory: './../db/migrations',
      }
    },

    staging: {
      client: 'mysql',
      connection: {
        database: 'datadump',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        directory: './../db/migrations',
      }
    },

    production: {
      client: 'mysql',
      connection: {
        database: 'datadump',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        directory: './../db/migrations',
      }
    }
  },
  destination: {
    development: {
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
      },
      migrations: {
        directory: './../db/migrations',
      }
    },

    staging: {
      client: 'mysql',
      connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        directory: './../db/migrations',
      }
    },

    production: {
      client: 'mysql',
      connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        directory: './../db/migrations',
      }
    }
  }
};