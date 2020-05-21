import { MongoClient } from 'mongodb'
require('dotenv').config()

const {
  MONGO_URL,
  MONGO_USER,
  MONGO_PASS
} = process.env

export const client = new MongoClient(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL}`,
  {
    useNewUrlParser: true,
     useUnifiedTopology: true
  }
)
