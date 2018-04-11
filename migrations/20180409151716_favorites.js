
exports.up = (knex, Promise) => (
  knex.schema.createTable('favorites', (t) => {
    t.increments()
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    t.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE')
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'))
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'))
  })
)

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('favorites')
