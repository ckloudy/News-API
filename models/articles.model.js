const db = require('../db/connection');

exports.selectArticleById = (id) => {
	return db
		.query(
			`SELECT author, title, article_id, body, topic, created_at, votes FROM articles WHERE article_id = $1;`,
			[ id ]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Article not found' });
			}
			return rows[0];
		});
};

exports.updatedVotesByArticleById = (id, update) => {
	return db
		.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*;`, [ id, update ])
		.then(({ rows }) => {
			console.log(rows);
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Article not found' });
			}
			return rows[0];
		});
};
