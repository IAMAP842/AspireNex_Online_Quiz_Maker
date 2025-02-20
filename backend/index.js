const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const app = express()
const port = 1000

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/quiz', require('./routes/quiz'))

connectToMongo();

app.listen(port, () => {
  console.log(`quiz backend listening on port ${port}`)
})


