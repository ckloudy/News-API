const express = require('express');
const { getTopics, getArticleById } = require('./controllers/topics.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:id', getArticleById);

// Error Handlers //

app.use((err, req, res, next) => {});

module.exports = app;
