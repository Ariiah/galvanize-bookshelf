
exports.up = function(knex, Promise) {
  knex.schema.createTable('favorites', (t) => {
    t.increments('id').primary()
    t.integer()
  })
};

exports.down = function(knex, Promise) {

};
