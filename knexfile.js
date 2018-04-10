'use strict';

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/bookshelf_dev'
    // migrations: {
    //   directory: './galvanize-bookshelf',
    //   tableName: 'g_bookshelf'
    // }
  },

  test: {
    client: 'postgresql',
    connection: 'postgres://localhost/bookshelf_test'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }
}
