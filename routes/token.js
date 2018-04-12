'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const knex = require('../knex')
const humps = require('humps')
const KEY = process.env.JWT_KEY

router.get('/', (q, s, next) => {
  if (q.cookies.token) {
    s.send(true)
  }
  else {
    s.send(false)
  }
})

// sign-in route

router.post('/', (q, s, next) => {
  knex('users')
    .select('*')
    .where('email', q.body.email)
    .first()
    .then((foundUser) => {
      if (foundUser){
        const {id, first_name, last_name, email, hashed_password} = foundUser
        bcrypt.compare(q.body.password, hashed_password, (err, result) => {
          if (err) {
            s.status(401).json('not authorized')
            } else {
            if(result) {
              const loggedInUser = {id, first_name, last_name, email}
              const token = jwt.sign(loggedInUser, KEY)

              s.setHeader('set-cookie', `token=${token}; Path=\/; +HttpOnly`)
              s.status(200).json(humps.camelizeKeys(loggedInUser))
            } else {
              next({ output: { statusCode: 400 }, message: 'Bad email or password'})
            }
          }
        })
      } else {
        next({ output: { statusCode: 400 }, message: 'Bad email or password'})
      }
    }).catch((err) => console.log('err', err))
})

router.delete('/', (q, s, next) => {
  s.setHeader('set-cookie', `token=; Path=\/; +HttpOnly`)
  s.send(true)
})

module.exports = router
