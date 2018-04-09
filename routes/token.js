'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const knex = require('../knex')
const humps = require('humps')
// const cookieParser = ('cookie-parser')
const KEY = process.env.JWT_KEY

router.get('/', (q, s, next) => {
  if (q.cookies.token) {
    s.send(true)
  }
  s.send(false)
})

router.post('/', (q, s, next) => {
  knex('users')
  .select('*')
  // check if the email matches
  .where('email', q.body.email)
  .then((users) => {
    let foundUser = users[0]
    // need all info so it can pull all of it from record
    let {id, email, hashed_password, first_name, last_name} = foundUser
    // compares password and hashed password to be the same
    bcrypt.compare(q.body.password, hashed_password, (err, result) => {
      if(err) {
        return s.status(401).send('not allowed')
      }
      if (result) {
        const token = jwt.sign(foundUser, hashed_password)
        s.cookie('token', token)
        s.setHeader('set-cookie', `token=${token}; Path=\/; HttpOnly`)
        // template literal to match what the test wants exactly
      }
      return s.status(200).send('worked!')
    })
    const decode = jwt.decode(q.cookies.token)
    console.log(decode);
        // let info = {id, email, first_name, last_name}
        // // create new obj so it can push the info it needs
        // if (!q.cookies.token){
        //   s = false
        // }
        // jwt.verify(q.cookies.token, KEY, (err, s) => {
        //   if (err) next(err)
        // })
        s.status(200).json(humps.camelizeKeys(info))
    })
})

// router.delete('/', (q, s, next) => {
//   knex('user')
//   .del()
// })

module.exports = router;
