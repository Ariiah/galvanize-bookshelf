
exports.up = (knex, Promise) => (
  knex.schema.createTable('users', (t) => {
    t.increments('id').primary()
    t.varchar('first_name', 255).notNull().defaultTo('')
    t.varchar('last_name', 255).notNull().defaultTo('')
    t.varchar('email', 255).notNull().unique()
    t.specificType('hashed_password', 'char(60)').notNull()
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'))
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'))

  })
)

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('users')
