const express = require('express') 
const app = express()

const {errorHandler} = require('./error_handlers/api_error_handlers')

const {
  getAPI
} = require('./controllers/api.controllers ')
const {
  getTopics
} = require('./controllers/topics.controllers')
const {
  getArticlesById
} = require ('./controllers/articles.controllers')



app.get('/api', getAPI)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticlesById)





app.use(errorHandler);



module.exports = app


