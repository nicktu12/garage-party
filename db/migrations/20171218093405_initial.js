
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('garage_items', function(table) {
      table.increments('id').primary();
      table.string('item_name');
      table.string('reason');
      table.string('cleanliness');
      table.timestamps(true, true);
    })
  ]); 
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('garage_items')
  ]);
};
