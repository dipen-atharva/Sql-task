module.exports = {
  source: {
    development: {
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'datadump',
        multipleStatements: true,
        timezone: "UTC",
        debug: false,
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
        password: process.env.DB_PASSWORD,
        timezone: "UTC",
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        directory: './../db/migrations',
      }
    }
  },
  destination: {
    development: {
      client: 'pg',
      connection: {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        port: process.env.PG_PORT,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_NAME,
        multipleStatements: true,
        timezone: "UTC",
        debug: false,
      },
      migrations: {
        directory: './../db/migrations',
      }
    },

    staging: {
      client: 'pg',
      connection: {
        database: process.env.PG_NAME,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
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
      client: 'pg',
      connection: {
        database: process.env.PG_NAME,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        timezone: "UTC",
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
