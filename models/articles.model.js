const db = require('../db/connection');

exports.selectArticles = () => {
	return db
		.query(
			`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments) AS INT) AS comment_count
			FROM articles
			LEFT JOIN comments ON articles.article_id = comments.article_id
			GROUP BY articles.article_id
    		ORDER BY articles.created_at DESC;`
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.selectArticleById = (id) => {
	return db
		.query(
			`SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments) AS INT) AS comment_count
			FROM articles
			LEFT JOIN comments ON articles.article_id = comments.article_id
			WHERE articles.article_id = $1
			GROUP BY articles.article_id;`,
			[ id ]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Article not found' });
			}
			return rows[0];
		});
};

exports.checkArticleExists = (id) => {
	return db.query(`SELECT * FROM articles WHERE article_id = $1`, [ id ]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Article not found' });
		}
	});
};

exports.selectCommentsForArticleId = (id) => {
	return db
		.query(`SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;`, [
			id
		])
		.then(({ rows }) => {
			return rows;
		});
};

exports.updatedVotesByArticleById = (id, update) => {
	return db
		.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*;`, [ id, update ])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Article not found' });
			}
			if (rows.length === 0 && typeof update != 'Number') {
				return Promise.reject({ status: 400, msg: 'Bad request' });
			}
			return rows[0];
		});
};
