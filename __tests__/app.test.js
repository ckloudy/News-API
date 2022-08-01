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
				expect(Object.keys(response.body.topics[0])).toEqual(
					expect.arrayContaining([ 'slug', 'description' ])
				);
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
