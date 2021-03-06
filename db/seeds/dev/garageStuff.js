/* eslint-disable func-names, prefer-arrow-callback, no-console */

exports.seed = function (knex, Promise) {
  return knex('garage_items').del()
    .then(function () {
      return Promise.all([
        knex('garage_items').insert([
          {
            id: 1,
            item_name: 'table saw',
            reason: 'destruction of planks',
            cleanliness: 'sparkling',
          },
          {
            id: 2,
            item_name: 'lawnmover',
            reason: 'lawn maintenence',
            cleanliness: 'dusty',
          },
          {
            id: 3,
            item_name: 'shovel',
            reason: 'scooping',
            cleanliness: 'rancid',
          },
        ]),
      ])
        .then(() => console.log('Seeding is complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`));
    });
};
