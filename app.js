const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const api = require('./routes/api')
const index = require('./routes/index')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000

app.set('view engine', 'pug')
app.set('view cache', false)

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))

app.use('/', index)
app.use('/api', api)

server.listen(port, () => {
  console.log('Server listening on ' + port)
})
