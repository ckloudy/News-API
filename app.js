const express = require('express');
const { handleCustomErrors, handlePsqlErrors, unrecognisedPathError } = require('./error_handlers');

const { getTopics } = require('./controllers/topics.controller');
const { getArticleById } = require('./controllers/articles.controller');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:id', getArticleById);

// Error Handlers //

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.all('/*', unrecognisedPathError);

module.exports = app;
