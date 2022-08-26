const db = require('../db/connection');

exports.selectArticles = (sort = 'created_at', order = 'DESC', topic) => {
  const sortValues = [
    'article_id',
    'title',
    'author',
    'created_at',
    'votes',
    'comment_count'
  ];
  const orderValues = [ 'ASC', 'DESC' ];
  let topicValue = [];

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments) AS INT) AS comment_count
	FROM articles
	LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic !== undefined) {
    topicValue.push(topic);
    queryStr += `WHERE topic = $1 `;
  }

  const groupByStr = `GROUP BY articles.article_id `;
  const orderStr = `ORDER BY ${sort} ${order};`;

  if (sortValues.includes(sort) && orderValues.includes(order)) {
    return db
      .query(queryStr + groupByStr + orderStr, topicValue)
      .then(({ rows }) => rows);
  } else {
    return Promise.reject({ status: 400, msg: 'Invalid Query' });
  }
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

exports.selectCommentsForArticleId = (id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [ id ]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updatedVotesByArticleById = (id, update) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*;`,
      [ id, update ]
    )
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

exports.insertCommentOnArticleId = (id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [ id, username, body ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [ id ])
    .then(({ rows }) => {
      return rows;
    });
};
