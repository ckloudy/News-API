const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('\nGOOD ENDPOINTS\n', () => {
	describe('/api/topics', () => {
		describe('GET', () => {
			test('Status 200: returns an array of topics', () => {
				return request(app).get('/api/topics').expect(200).then((response) => {
					expect(response.body.topics).toEqual(expect.any(Array));
				});
			});
			test('Status 200: returns an array of objects with the correct properties', () => {
				return request(app).get('/api/topics').expect(200).then((response) => {
					const allTopics = response.body.topics;
					allTopics.forEach((topic) => {
						expect(topic.hasOwnProperty('slug')).toBe(true);
						expect(topic.hasOwnProperty('description')).toBe(true);
					});
				});
			});
		});
	});
	describe('/api/articles', () => {
		describe('GET', () => {
			test('Status 200: returns an array of articles', () => {
				return request(app).get('/api/articles').expect(200).then((response) => {
					expect(response.body.articles).toEqual(expect.any(Array));
				});
			});
			test('Status 200: returns an array of objects with the correct properties and value types', () => {
				return request(app).get('/api/articles').expect(200).then((response) => {
					const allArticles = response.body.articles;
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('comment_count');
						expect(article.comment_count).toEqual(expect.any(Number));
					});
				});
			});
		});
	});
	describe('/api/articles/:article_id', () => {
		describe('GET', () => {
			test('Status 200: returns an article by an ID number', () => {
				return request(app).get('/api/articles/1').expect(200).then((response) => {
					const article = response.body.article;
					expect(article.author).toEqual(expect.any(String)),
						expect(article.article_id).toBe(1),
						expect(article.title).toEqual(expect.any(String)),
						expect(article.topic).toEqual(expect.any(String)),
						expect(article.created_at).toEqual(expect.any(String)),
						expect(article.votes).toEqual(expect.any(Number));
				});
			});
			test('Status 200: returns an article by an ID number with a comment count column', () => {
				return request(app).get('/api/articles/1').expect(200).then((response) => {
					const article = response.body.article;
					expect(article).toHaveProperty('comment_count');
					expect(article.comment_count).toEqual(expect.any(Number));
				});
			});
		});
	});
	describe('/api/articles/:article_id', () => {
		describe('PATCH', () => {
			test('Status 201: specified article_id article has been updated with votes incremented by passed object value', () => {
				const inc_vote = { inc_vote: 5 };
				return request(app)
					.patch('/api/articles/1')
					.send(inc_vote)
					.expect(201)
					.then((response) => {
						expect(response.body.article.article_id).toBe(1);
						expect(response.body.article.votes).toBe(105);
					});
			});
			test('Status 201: specified article_id article has been updated with votes decremented by passed object value', () => {
				const inc_vote = { inc_vote: -5 };
				return request(app)
					.patch('/api/articles/1')
					.send(inc_vote)
					.expect(201)
					.then((response) => {
						expect(response.body.article.article_id).toBe(1);
						expect(response.body.article.votes).toBe(95);
					});
			});
		});
	});
	describe('/api/articles/:article_id/comments', () => {
		describe('GET', () => {
			test('Status 200: returns an array of comments for the given article ID', () => {
				return request(app).get('/api/articles/1/comments').expect(200).then((response) => {
					const comments = response.body.comments;
					expect(comments).toEqual(expect.any(Array));
				});
			});
			test('Status 200: returns an array with the correct properties', () => {
				return request(app).get('/api/articles/1/comments').expect(200).then((response) => {
					const comments = response.body.comments;
					comments.forEach((comment) => {
						expect(comment).toHaveProperty('comment_id');
						expect(comment).toHaveProperty('votes');
						expect(comment).toHaveProperty('created_at');
						expect(comment).toHaveProperty('author');
						expect(comment).toHaveProperty('body');
					});
				});
			});
		});
	});
	describe('/api/users', () => {
		describe('GET', () => {
			test('Status 200: returns an array of users', () => {
				return request(app).get('/api/users').expect(200).then((response) => {
					expect(response.body.users).toEqual(expect.any(Array));
				});
			});
			test('Status 200: returns an array of objects with the correct properties', () => {
				return request(app).get('/api/users').expect(200).then((response) => {
					const allUsers = response.body.users;
					allUsers.forEach((user) => {
						expect(user.hasOwnProperty('username')).toBe(true);
						expect(user.hasOwnProperty('name')).toBe(true);
						expect(user.hasOwnProperty('avatar_url')).toBe(true);
					});
				});
			});
		});
	});
});

describe('\nERROR HANDLING\n', () => {
	describe('/api/notARoute', () => {
		describe('GET ERROR', () => {
			test('Status 404: Path not found', () => {
				return request(app).get('/api/notARoute').expect(404).then((response) => {
					expect(response.body.msg).toBe('Path not found');
				});
			});
		});
	});
	describe('/api/articles/99(404) & /api/articles/notAnId(400)', () => {
		describe('GET ERROR', () => {
			test('Status 404: Not Found', () => {
				return request(app).get('/api/articles/99').expect(404).then((response) => {
					expect(response.body.msg).toBe('Article not found');
				});
			});
			test('Status 400: Bad request', () => {
				return request(app).get('/api/articles/notAnId').expect(400).then((response) => {
					expect(response.body.msg).toBe('Bad request');
				});
			});
		});
	});
	describe('/api/articles/99(404) & /api/articles/notAnId(400)', () => {
		describe('PATCH ERROR', () => {
			test('Status 404: Not Found', () => {
				return request(app).patch('/api/articles/99').expect(404).then((response) => {
					expect(response.body.msg).toBe('Article not found');
				});
			});
			test('Status 400: Bad request', () => {
				return request(app).patch('/api/articles/notAnId').expect(400).then((response) => {
					expect(response.body.msg).toBe('Bad request');
				});
			});
			test('Status 400: Bad request {inc_vote: banana}', () => {
				const inc_vote = { inc_vote: 'banana' };
				return request(app).patch('/api/articles/1').send(inc_vote).then((response) => {
					expect(response.body.msg).toBe('Bad request');
				});
			});
		});
	});
	describe('/api/articles/notAnId/comments & /api/articles/1/notApath & /api/articles/99/comments', () => {
		describe('GET ERROR', () => {
			test('Status 404: Not Found', () => {
				return request(app)
					.get('/api/articles/notAnId/comments')
					.expect(400)
					.then((response) => {
						expect(response.body.msg).toBe('Bad request');
					});
			});
			test('Status 404: Path not found - /api/articles/1/notAath', () => {
				return request(app).get('/api/articles/1/notApath').expect(404).then((response) => {
					expect(response.body.msg).toBe('Path not found');
				});
			});
			test('Status 404: Not Found', () => {
				return request(app).get('/api/articles/99/comments').expect(404).then((response) => {
					expect(response.body.msg).toBe('Article not found');
				});
			});
		});
	});
});
