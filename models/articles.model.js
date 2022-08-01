const db = require('../db/connection');

exports.selectArticleById = (id) => {
	return db
		.query(
			`SELECT author, title, article_id, body, topic, created_at, votes FROM articles WHERE article_id = $1;`,
			[ id ]
		)
		.then(({ rows: articles }) => {
			console.log(articles[0]);
			return articles[0];
		});
};
