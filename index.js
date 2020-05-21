import express from 'express'
import { client } from './db'
import crypto from 'crypto'

require('dotenv').config()

const {
  API_PORT
} = process.env

let db
client.connect(error => {
  error && console.log({error})
  db = client.db('waverly')
})


const api = express()

api.use(express.json())

api.get('/all', async (req, res) => {
  const data = await db.collection('users').find().toArray()

  res.send(data)
})

api.delete('/user', async ({body: {username}}, res) => {

  const doc = await db.collection('users').findOne({ username })

  if (!doc) {
    res.status('404')
    res.send(`User ${username} does not exist.`)

    return
  }

  const { _id } = doc
  const {
    acknowledged,
    deletedCount
  } = await db.collection('users').deleteOne({ _id })

  if (acknowledged) res.status('204')

  res.send('ok')
})

api.post('/create', async ({ body: {
  username,
  password
}}, res) => {
  const doc = await db.collection('users').findOne({username})

  if (doc) {
    res.status(409)
    res.send(`User ${username} already exists.`)
    return
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`)
  const { insertedId } = await db.collection('users').insertOne({
    username,
    password: hash,
    salt
  })

  if (insertedId) res.status('204')

  res.send({
    username,
    password,
    salt
  })
})

api.post('/login', async ({ body: {
  username,
  password
}}, res) => {
  const doc = await db.collection('users').findOne({username})

  if (!doc) {
    res.status(404)
    res.send(`User ${username} does not exist`)
    return
  }

  const { salt, password: hash } = doc
  const compareHash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex')

  console.log({
    compareHash,
    hash
  })
  if (compareHash != hash) {
    res.status(401)
    res.send(`Invalid password`)
    return
  }

  res.status(200)
  res.send({
    username,
  })
})

api.listen(
  API_PORT,
  () => console.log(`listening at http://localhost:${API_PORT}`)
)
