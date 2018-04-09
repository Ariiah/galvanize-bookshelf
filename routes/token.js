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
  // console.log('body', q.body);

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
        // console.log('bad email or password');
        next({ output: { statusCode: 400 }, message: 'Bad email or password'})
      }

    })
      .catch((err) => console.log('err', err))

})

// router.post('/', (q, s, next) => {
//   knex('users')
//   .select('*')
//   // check if the email matches
//   .where('email', q.body.email)
//   .then((users) => {
//     let foundUser = users[0]
//     // need all info so it can pull all of it from record
//     let {id, email, hashed_password, first_name, last_name} = foundUser
//     // compares password and hashed password to be the same
//     console.log('hashed_password:', hashed_password);
//     console.log('KEY:', KEY);
//     console.log('foundUser:', foundUser);
//     bcrypt.compare(q.body.password, hashed_password, (err, result) => {
//       // if(err) {
//       //   s.status(401).send('not allowed')
//       // }
//       if (result) {
//         const token = jwt.sign(foundUser, KEY)
//         // s.cookie('token', token)
//           s.cookie('token', token, { path: '/', httpOnly: true }).status(200).json(foundUser)
//         // template literal to match what the test wants exactly
//         // s.setHeader('set-cookie', `token=${token}; Path=\/; parseInt(HttpOnly)`)
//       }
//       // return s.status(200).send('worked!')
//     })
//         let info = {id, email, first_name, last_name}
//         // create new obj so it can push the info it needs
//         // if (!q.cookies.token){
//         //   s.send(false)
//         // }
//         jwt.verify(q.cookies.token, KEY, (err, s) => {
//           if (err){
//             next(err)
//           } else {
//             next(foundUser)
//           }
//         })
//         s.status(200).json(humps.camelizeKeys(info))
//     })
// })

// router.delete('/', (q, s, next) => {
//   knex('user')
//   .del()
// })

module.exports = router;
