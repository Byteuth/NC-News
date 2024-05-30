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
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
  addCommentToArticleId,
  patchArticleVotesByArticleId
} = require ('./controllers/articles.controllers')

app.use(express.json());


app.get('/api', getAPI)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticlesById)
app.patch('/api/articles/:article_id', patchArticleVotesByArticleId)


app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', addCommentToArticleId)





app.use(errorHandler);



module.exports = app


