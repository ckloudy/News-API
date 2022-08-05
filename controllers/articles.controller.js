const {
	selectArticles,
	selectArticleById,
	updatedVotesByArticleById,
	selectCommentsForArticleId,
	insertCommentOnArticleId
} = require('../models/articles.model');

const { checkArticleExists, checkTopic, checkUserExists } = require('../db/seeds/utils');

exports.getArticles = (req, res, next) => {
	const { sort_by, order, topic } = req.query;
	const promiseArray = [ selectArticles(sort_by, order, topic) ];
	if (topic !== undefined) {
		promiseArray.push(checkTopic(topic));
	}
	Promise.all(promiseArray)
		.then((articles) => {
			res.status(200).send({ articles: articles[0] });
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
