const { selectArticleById, updatedVotesByArticleById } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
	const { id } = req.params;
	selectArticleById(id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.updateArticleById = (req, res, next) => {
	const { inc_vote } = req.body;
	const { id } = req.params;
	updatedVotesByArticleById(id, inc_vote)
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch(next);
};
