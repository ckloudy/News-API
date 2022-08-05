const {
	selectArticles,
	selectArticleById,
	updatedVotesByArticleById,
	selectCommentsForArticleId,
	checkArticleExists,
	insertCommentOnArticleId
} = require('../models/articles.model');

const { checkUserExists } = require('../models/users.model');

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
	Promise.all([ checkArticleExists(id), selectCommentsForArticleId(id) ])
		.then(([ , comments ]) => {
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

exports.addCommentOnArticleId = (req, res, next) => {
	const { id } = req.params;
	const { username } = req.body;
	Promise.all([ checkUserExists(username), checkArticleExists(id), insertCommentOnArticleId(id, req.body) ])
		.then(([ , , comment ]) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};
