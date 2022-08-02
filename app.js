const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getArticleById } = require('./controllers/articles.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:id', getArticleById);

// Error Handlers //

app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request' });
	}
	const { status, msg } = err;
	res.status(status).send({ msg });
});

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Path not found' });
});

module.exports = app;
