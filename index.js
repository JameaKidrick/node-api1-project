/******************************** SERVER SETUP ********************************/

// implement your API here
console.log("\n=== Running! ===\n")

// import express
const express = require('express');

// import database
const db = require('./data/db');

// create server
const server = express();

// list for requests in port 5000 of localhost
const port = 5000; // localhost:5000
server.listen(port, () => console.log('\n=== listening to port 5000 ===\n'))

// add middleware to teach express how to read json
  // needed for post and put to work
server.use(express.json());

/******************************** REQUEST HANDLERS ********************************/

// TEST: GET request to localhost: 5000
server.get('/', (req, res) => { // localhost:5000
  res.send('Hello World!')
})
  // TEST PASSED


// POST: creates user using the info sent inside of the req.body (request body)
server.post('/api/users', (req, res) => { // localhost:5000/api/users
  const user = req.body;
  console.log('user', user) //checking what is sent

  // if name or bio are not added at all (undefined) or if name and bio are an empty string ('') return 400 error
  if((user.name === undefined || user.name === '') || (user.bio === undefined || user.bio === '')){
    res.status(400).json({ error: "Please provide name and bio for the user." });
  }else{
  // if there is no error, add user to db and return id of user
    db.insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    // if there is an error, return error 500
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
  }
})

// GET: returns an array of `all the users` in the db
server.get('/api/users', (req, res) => { // localhost:5000/api/users
  // return all users in the db
  db.find()
    .then(users => {
      res.status(200).json(users)
    })
    // if there is an error, return error 500
    .catch(err => {
      res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

// GET: returns the `user` with the requested id
server.get('/api/users/:id', (req, res) => { // localhost:5000/api/users/id
  // setting id to the request's id that is given through parameters
  const id = req.params.id;
  // find user
  db.findById(id)
    .then(user => {
      // if no user with the id exists, return error 404
      if(user === undefined){
        res.status(404).json({ error: "The user with the specified ID does not exist." })
      }else{
      // user does exist, return user
        res.status(202).json(user)
      }
    })
    // if there is an error, return error 500
    .catch(err => {
      res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

// DELETE: deletes specified user from db
server.delete('/api/users/:id', (req, res) => { // localhost:5000/api/users/id
  // setting id to the request's id that is given through parameters
  const id = req.params.id;
  // delete user
  db.remove(id)
    .then(user => {
    // if no user with the id exists, return error 404
      if(!user){
        res.status(404).json({ error: "The user with the specified ID does not exist." })
      }else{
      // user does exist, return message
        res.status(205).json({ message: `hubs with id ${id} deleted`})
      }
    })
    // if there is an error, return error 500
    .catch(err => {
      res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

// POST: updates specified user data in the db
server.put('/api/users/:id', (req, res) => { // localhost:5000/api/users/id
  // setting id to the request's id that is given through parameters
  const id = req.params.id;
  const userInfo = req.body;
  // if name or bio are not added at all (undefined) or if name and bio are an empty string ('') return 400 error
  if((userInfo.name === undefined || userInfo.name === '') || (userInfo.bio === undefined || userInfo.bio === '')){
    res.status(400).json({ error: "Please provide name and bio for the user." });
  }else{
    // update user
    db.update(id, userInfo)
      .then(user => {
        if(!user){
          // if no user with the id exists, return error 404
          res.status(404).json({ error: "The user with the specified ID does not exist." })
        }else{
          // get modified user
          res.status(200).json(userInfo)
        }
      })
      .catch(err => {
        // if there is an error, return error 500
        res.status(500).json({ error: "The user information could not be modified." })
      })
  }
})

