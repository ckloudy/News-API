const express = require('express');
const { handleCustomErrors, handlePsqlErrors, unrecognisedPathError } = require('./error_handlers');

const { getTopics } = require('./controllers/topics.controller');
const { getArticles, getArticleById, updateArticleById } = require('./controllers/articles.controller');
const { getUsers } = require('./controllers/users.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:id', getArticleById);
app.patch('/api/articles/:id', updateArticleById);

app.get('/api/users', getUsers);

// Error Handlers //

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.all('/*', unrecognisedPathError);

module.exports = app;
