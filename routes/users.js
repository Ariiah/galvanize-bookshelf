'use strict';

const express = require('express')
const knex = require('../knex')
const humps = require('humps')
const bcrypt = require('bcrypt')
const router = express.Router()

router.post('/', (q, s, next) => {
  const hashedPassword = bcrypt.hashSync(q.body.password, 5)
  knex('users')
  .insert({
    'first_name': q.body.firstName,
    'last_name': q.body.lastName,
    'email': q.body.email,
    'hashed_password': hashedPassword
  })
  .returning(['id', 'first_name', 'last_name', 'email'])
  .then((newUser) => s.json(humps.camelizeKeys(newUser[0])))
  .catch((err) => {
    next(err)
  })
})


module.exports = router
