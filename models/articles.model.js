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
