exports.up = (knex, Promise) => (
  knex.schema.createTable('books', (t) => {
    t.increments('id').primary()
    t.varchar('title', 255).notNullable().defaultTo('')
    t.varchar('author', 255).notNull().defaultTo('')
    t.varchar('genre', 255).notNull().defaultTo('')
    t.text('description').notNull().defaultTo('')
    t.text('cover_url').notNull().defaultTo('')
    // t.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    t.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
    // t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    t.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'))

  })
)

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('books')
