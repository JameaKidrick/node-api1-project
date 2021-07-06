const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
};

// calling `find` returns a promise that resolves to an array of all the users contained in the database
function find() {
  return db('users');
}

// this method expects an `id` as it's only parameter and returns the user corresponding to the `id` provided or an empty array if no user with that `id` is found
function findById(id) {
  return db('users')
    .where({ id: Number(id) })
    .first();
}

// calling insert passing it a user object will add it to the database and return an object with the `id` of the inserted user. The object looks like this: `{ id: 123 }`
function insert(user) {
  return db('users')
    .insert(user)
    .then(ids => ({ id: ids[0] }));
}

// accepts two arguments, the first is the `id` of the user to update and the second is an object with the `changes` to apply. It returns the count of updated records. If the count is 1 it means the record was updated correctly
function update(id, user) {
  return db('users')
    .where('id', Number(id))
    .update(user);
}

// the `remove` method accepts an `id` as it's first parameter and upon successfully deleting the user from the database it returns the number of records deleted
function remove(id) {
  return db('users')
    .where('id', Number(id))
    .del();
}
