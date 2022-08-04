const {
	selectArticles,
	selectArticleById,
	updatedVotesByArticleById,
	selectCommentsForArticleId
} = require('../models/articles.model');

exports.getArticles = (req, res, next) => {
	selectArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { id } = req.params;
	selectArticleById(id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getCommentsForArticleId = (req, res, next) => {
	const { id } = req.params;
	selectCommentsForArticleId(id)
		.then((comments) => {
			res.status(200).send({ comments });
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
