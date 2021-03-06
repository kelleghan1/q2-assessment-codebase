
exports.up = function(knex, Promise) {
  return knex.schema.createTable('authors_books', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.integer('book_id').notNullable().references('books.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.integer('author_id').notNullable().references('authors.id').onUpdate('CASCADE').onDelete('CASCADE');

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('authors_books');
};
