const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/topics', () => {
	describe('GET', () => {
		test('Status 200: returns an array of topics', () => {
			return request(app).get('/api/topics').expect(200).then((response) => {
				expect(response.body.topics).toEqual(expect.any(Array));
			});
		});
		test('Status 200: returns an array with the correct properties', () => {
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

describe('/api/notARoute', () => {
	describe('GET ERROR', () => {
		test('Status 404: Not Found', () => {
			return request(app).get('/api/notARoute').expect(404);
		});
	});
});

describe('/api/articles/:article_id', () => {
	describe('GET', () => {
		test('returns an article by an ID number', () => {
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

describe('/api/articles/:article_id', () => {
	describe('PATCH', () => {
		test('Status 201: specified article_id article has been updated with votes incremented by passed object value', () => {
			const inc_vote = { inc_vote: 5 };
			return request(app).patch('/api/articles/1').send(inc_vote).expect(201).then((response) => {
				expect(response.body.article.article_id).toBe(1);
				expect(response.body.article.votes).toBe(105);
			});
		});
		test('Status 201: specified article_id article has been updated with votes decremented by passed object value', () => {
			const inc_vote = { inc_vote: -5 };
			return request(app).patch('/api/articles/1').send(inc_vote).expect(201).then((response) => {
				expect(response.body.article.article_id).toBe(1);
				expect(response.body.article.votes).toBe(95);
			});
		});
	});
});

describe('/api/articles/99(404) & /api/articles/notAnId(400)', () => {
	describe('PATCH ERROR', () => {
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
