const express = require('express');
const { getTopics } = require('./controllers/topics.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

// Error Handlers //

app.use((err, req, res, next) => {});

module.exports = app;
