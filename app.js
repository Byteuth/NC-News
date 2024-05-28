const express = require('express') 
const app = express()

const {error_handler} = require('./error_handlers/api_error_handlers')

const {
  getAPI
} = require('./controllers/api.controllers ')
const {
  getTopics
} = require('./controllers/topics.controllers')



app.get('/api', getAPI)
app.get('/api/topics', getTopics)





app.use(error_handler);



module.exports = app


