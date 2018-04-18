'use strict'

const express = require('express')
const knex = require('../knex')
const humps = require('humps')
// eslint-disable-next-line new-cap
const router = express.Router()

router.get('/', (q, s, next) => {
  knex('books')
    .select('*')
    .orderBy('title', 'asc')
    .then((allEntries) => allEntries.map(keyEntries => humps.camelizeKeys(keyEntries)))
    .then((returnCamel) => s.json(returnCamel))
})

router.get('/:id', (q, s, next) => {
  knex('books')
    .select('*')
    .where('id', q.params.id)
    .first()
    .then((firstEntry) => s.json(humps.camelizeKeys(firstEntry)))
})

router.post('/', (q, s, next) => {
  knex('books')
    .insert({
      'title': q.body.title,
      'author': q.body.author,
      'genre': q.body.genre,
      'description': q.body.description,
      'cover_url': q.body.coverUrl
    })
    .returning('*')
    .then((newBook) => s.json(humps.camelizeKeys(newBook[0])))
})

router.patch('/:id', (q, s, next) => {
  knex('books')
    .where('id', q.params.id)
    .limit(1)
    .update(humps.decamelizeKeys(q.body))
    .returning('*')
    .then((newInfo) => s.json(humps.camelizeKeys(newInfo[0])))
})

router.delete('/:id', (q, s, next) => {
  knex('books')
    .where('id', q.params.id)
    .del()
    .returning('*')
    .then((idDeleted) => {
      let [origObj] = idDeleted
      delete origObj.id
      s.json(humps.camelizeKeys(origObj))
    })
})
module.exports = router
