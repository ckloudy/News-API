const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('\nGOOD ENDPOINTS\n', () => {
  describe('/api', () => {
    describe('GET', () => {
      test('Status 200: returns an object of endpoints', () => {
        return request(app).get('/api').expect(200).then((response) => {
          console.log(response.body);
          expect(response.body).toEqual(expect.any(Object));
        });
      });
    });
  });
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
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toEqual(expect.any(Array));
          });
      });
      test('Status 200: returns an array of objects with the correct properties and value types', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((response) => {
            const allArticles = response.body.articles;
            allArticles.forEach((article) => {
              expect(article).toHaveProperty('comment_count');
              expect(article.comment_count).toEqual(expect.any(Number));
            });
          });
      });
    });
  });
  describe('/api/articles?QUERY', () => {
    describe('GET', () => {
      test('Status 200: returns an array of articles sorted by author in ascending order', () => {
        return request(app)
          .get('/api/articles?sort_by=author&order=ASC&topic=mitch')
          .expect(200)
          .then((response) => {
            const articles = response.body.articles;
            expect(articles).toEqual(expect.any(Array));
            expect(articles).toBeSortedBy('topic', { ascending: true });
          });
      });
    });
  });
  describe('/api/articles/:article_id', () => {
    describe('GET', () => {
      test('Status 200: returns an article by an ID number', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((response) => {
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
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((response) => {
            const article = response.body.article;
            expect(article).toHaveProperty('comment_count');
            expect(article.comment_count).toEqual(expect.any(Number));
          });
      });
    });
  });
  describe('/api/articles/:article_id - PATCH', () => {
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
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((response) => {
            const comments = response.body.comments;
            expect(comments).toEqual(expect.any(Array));
          });
      });
      test('Status 200: returns an array with the correct properties', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((response) => {
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
      test('Status 200: returns a message if the article does not have any comments', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then((response) => {
            const comments = response.body.comments;
            expect(comments).toEqual([]);
          });
      });
    });
  });
  describe('/api/articles/:article_id/comments - POST', () => {
    describe('POST', () => {
      test('Status 201: adds a comment to the given article ID', () => {
        const newComment = {
          username: 'rogersop',
          body: 'This is a new dumb comment or meme'
        };
        return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(201)
          .then((response) => {
            const comment = response.body.comment;
            expect(comment).toEqual(expect.any(Object));
          });
      });
      test('Status 200: returns an array with the correct properties', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((response) => {
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
      test('Status 200: returns a message if the article does not have any comments', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then((response) => {
            const comments = response.body.comments;
            expect(comments).toEqual([]);
          });
      });
    });
  });
  describe('/api/comments/:comments_id - DELETE', () => {
    describe('DELETE', () => {
      test('Status 204: removes a comment with the passed comment ID', () => {
        return request(app)
          .delete('/api/comments/3')
          .expect(204)
          .then((response) => {
            expect(response.body).toEqual({});
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
        return request(app)
          .get('/api/notARoute')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Path not found');
          });
      });
    });
  });
  describe('/api/articles/99(404) & /api/articles/notAnId(400)', () => {
    describe('GET ERROR', () => {
      test('Status 404: Not Found', () => {
        return request(app)
          .get('/api/articles/99')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Article not found');
          });
      });
      test('Status 400: Bad request', () => {
        return request(app)
          .get('/api/articles/notAnId')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
    });
  });
  describe('/api/articles/99(404) & /api/articles/notAnId(400)', () => {
    describe('PATCH ERROR', () => {
      test('Status 404: Not Found', () => {
        return request(app)
          .patch('/api/articles/99')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Article not found');
          });
      });
      test('Status 400: Bad request', () => {
        return request(app)
          .patch('/api/articles/notAnId')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
      test('Status 400: Bad request {inc_vote: banana}', () => {
        const inc_vote = { inc_vote: 'banana' };
        return request(app)
          .patch('/api/articles/1')
          .send(inc_vote)
          .then((response) => {
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
      test('Status 404: Path not found - /api/articles/1/notApath', () => {
        return request(app)
          .get('/api/articles/1/notApath')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Path not found');
          });
      });
      test('Status 404: Article Not Found', () => {
        return request(app)
          .get('/api/articles/99/comments')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Article not found');
          });
      });
    });
    describe('POST ERROR', () => {
      test('Not A User - Status 404: Must be logged in', () => {
        const newComment = {
          username: 'Damian',
          body: 'Another dumb comment or meme'
        };
        return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Must be logged in');
          });
      });
      test('Status 404: Article Not Found', () => {
        return request(app)
          .get('/api/articles/99/comments')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Article not found');
          });
      });
    });
  });
  describe('/api/articles/?QUERY', () => {
    describe('GET ERROR', () => {
      test('Status 404: Topic not found', () => {
        return request(app)
          .get('/api/articles?sort_by=author&topic=notAtopic')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('Topic not found');
          });
      });
      test('Status 400: Invalid Query', () => {
        return request(app)
          .get('/api/articles?sort_by=noAvalidColumn')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Invalid Query');
          });
      });
    });
  });
});
