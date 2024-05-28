const express = require('express') 
const app = express()
const {
  getTopics
} = require('./controllers/topics.controllers')


app.use(express.json())

app.get('/api/topics', getTopics)




app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).send({err: '404 not found'});
});



module.exports = app


