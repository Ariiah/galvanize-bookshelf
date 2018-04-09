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
    // const decode = jwt.decode(q.cookies.token)
    // console.log(decode)
    s.send(true)
  }
  else {
    s.send(false)
  }
})

router.post('/', (q, s, next) => {
  knex('users')
    .select('*')
    .where('email', q.body.email)
    .then((users) => {
      // console.log('users', users);
      if (users.length > 0){
        let foundUser = users[0]
        bcrypt.compare(q.body.password, foundUser.hashed_password, (err, result) => {
          if (err) {
            s.status(401).json('not authorized')
          }
          else
          {
            if(result) {
              const token = jwt.sign({'email': foundUser.email}, KEY)
              const infoNeeded = {
                'id': foundUser.id,
                'first_name': foundUser.first_name,
                'last_name': foundUser.last_name,
                'email': foundUser.email
              }
              s.setHeader('set-cookie', `token=${token}; Path=\/; +HttpOnly`)
              s.status(200).json(humps.camelizeKeys(infoNeeded))
            }
            else {
              next({ output: { statusCode: 400 }, message: 'Bad email or password'})
            }
          }
        })
      }
      else {
        next({ output: { statusCode: 400 }, message: 'Bad email or password'})
      }
    })
      .catch((err) => console.log('err', err))
})

router.delete('/', (q, s, next) => {
  s.setHeader('set-cookie', `token=; Path=\/; +HttpOnly`)
  s.send(true)
})

module.exports = router
