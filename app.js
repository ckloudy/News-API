const express = require('express');
const cors = require('cors');
const {
  handleCustomErrors,
  handlePsqlErrors,
  unrecognisedPathError
} = require('./error_handlers');

const { getTopics } = require('./controllers/topics.controller');
const {
  getArticles,
  getArticleById,
  updateArticleById,
  getCommentsForArticleId,
  addCommentOnArticleId,
  removeCommentById
} = require('./controllers/articles.controller');
const { getUsers } = require('./controllers/users.controller');
const { getEndpoints } = require('./controllers/api.controller');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:id', getArticleById);
app.get('/api/articles/:id/comments', getCommentsForArticleId);
app.patch('/api/articles/:id', updateArticleById);
app.post('/api/articles/:id/comments', addCommentOnArticleId);
app.delete('/api/comments/:id', removeCommentById);

app.get('/api/users', getUsers);

// Error Handlers //

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.all('/*', unrecognisedPathError);

module.exports = app;
