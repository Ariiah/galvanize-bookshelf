'use strict';

const express = require('express')
const router = express.Router()
const humps = require('humps')
const knex = require('../knex')
const jwt = require('jsonwebtoken')

const authenticated = (q, s, next) => {
  if (q.cookies.token) {
    jwt.verify(q.cookies.token, process.env.JWT_KEY, (err, payload) => {
      if (err) next (err)
      q.token = payload
    })
  } else {
    next({ output: { statusCode: 401 }, message: 'Unauthorized'})
  }
  next()
}

router.get('/', authenticated, (q, s, next) => {
  knex('favorites')
    // calls which table it needs, currentTable.key from other table, originalTable.key
    .join('books', 'favorites.book_id', 'books.id')
    .select('*')
    .then((allFavs) =>  {
        const camelized = allFavs.map((entry) => humps.camelizeKeys(entry))
        s.json(camelized)
    })
    .catch((err) => console.log('err: ', err))
})

router.get('/check', authenticated, (q, s, next) => {
  console.log(q.query);
  knex('favorites')
  .where('book_id', q.query.bookId)
  .join('books', 'favorites.book_id', 'books.id')
  .select('*')
  .returning('*')
  .then((result) => {
    if (result.length === 0) {
      s.json(false)
    }
    else if (parseInt(q.query.bookId) === result[0].book_id){
      s.json(true)
    }
  })
})

router.post('/', authenticated, (q, s, next) => {
  const token = jwt.decode(q.cookies.token)
  knex('favorites')
    .insert({
      'book_id': q.body.bookId,
      'user_id': token.id
    })
    .returning('*')
    .then((newFav) => s.json(humps.camelizeKeys(newFav[0])))
})

router.delete('/', authenticated, (q, s, next) => {
  const { bookId } = q.body
  knex('favorites')
    .where('book_id', bookId)
    .del()
    .returning('*')
    .then((favDeleted) => {
      let [oldObj] = favDeleted
      delete oldObj.id
      s.json(humps.camelizeKeys(oldObj))

    })
})

module.exports = router
