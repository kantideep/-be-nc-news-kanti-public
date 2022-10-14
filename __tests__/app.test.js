const request = require('supertest');

const app = require('../app');

const db = require("../db/connection");

const seed = require("../db/seeds/seed")

const data = require('../db/data/test-data');

beforeEach(() => seed(data));

afterAll(() => {
    if (db.end) db.end();
});

describe('ALL /*', () => {
    test('404: for endpoint not found', () => {
        return request(app)
            .get('/non_existent_endpoint')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Endpoint not found');
            });
    });
});

describe('Task 3: GET /api/topics', () => {
    test('200: responds with an array of topic objects', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics).toHaveLength(3);
                expect(topics).toBeInstanceOf(Array);
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    );
                });
            });
    });
});

describe('Task 4: GET /api/articles/:article_id', () => {
    test('200: responds with a single matching article', () => {
        const ARTICLE_ID = 1;
        return request(app)
            .get(`/api/articles/${ARTICLE_ID}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    author: 'butter_bridge',
                    title: 'Living in the shadow of a great man',
                    article_id: ARTICLE_ID,
                    body: 'I find this existence challenging',
                    topic: 'mitch',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    comment_count: 11
                });
            });
    });
    test('400: returns an error when passed an ID of an invalid type', () => {
        return request(app)
            .get('/api/articles/banana')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid ID!');
            })
    });
    test('404: returns an error message when passed an article id that is of the correct type but does not exist in the database', () => {
        return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('ID not found!')
            })
    });
});

describe('Task 5: GET /api/users', () => {
    test('200: responds with an array of topic objects ', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users).toHaveLength(4);
                expect(users).toBeInstanceOf(Array);
                users.forEach((user) => {
                    expect.objectContaining({

                    })
                })
            })
    });
});

describe('Task 6: PATCH /api/articles/:article_id', () => {
    test('200: responds with updated article when given a object with newVote object', () => {
        const newVoteObj = { inc_votes: 200 };
        return request(app)
            .patch('/api/articles/1')
            .send(newVoteObj)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedArticle).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 300
                })
            })
    });
    test('400: if passed an incorrect value in vote object', () => {
        const newVoteObj = { inc_votes: 'five' };
        return request(app)
            .patch('/api/articles/1')
            .send(newVoteObj)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Wrong data type!');
            });
    });
    test('400: if passed an incorrect key in vote object', () => {
        const newVoteObj = { wrongKey: 200 };
        return request(app)
            .patch('/api/articles/1')
            .send(newVoteObj)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Missing key!');
            });
    });
    test('400: returns an error when passed an ID of an invalid type', () => {
        const newVoteObj = { inc_votes: 200 };
        return request(app)
            .patch('/api/articles/banana')
            .send(newVoteObj)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid ID!');
            })
    });
    test('404: returns an error message when passed an article id that is of the correct type but does not exist in the database', () => {
        const newVoteObj = { inc_votes: 200 };
        return request(app)
            .patch('/api/articles/99999')
            .send(newVoteObj)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('ID not found!')
            })
    });
});

describe('Task 8: GET /api/articles', () => {
    test('200: responds with an array of articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(5);
                expect(articles).toBeInstanceOf(Array);
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            body: expect.any(String),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)

                        })
                    );
                });
            });
    });
    test('200: responds with articles ordered by dates in descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSortedBy('created_at', { descending: true, coerce: true });
            });
    });
    test('200: return a list of articles filtered by only a given topic', () => {
        return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(4);
                articles.forEach((article) => {
                    expect(article.topic).toEqual('mitch');
                });
            });
    });
    test('404: if topic does not exist', () => {
        return request(app)
            .get('/api/articles?topic=thisTopicNotAvailable')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Topic doesn\'t exist!')
            })
    });
});

describe('Task 9: GET /api/articles/:article_id/comments ', () => {
    test('200: brings back a comment object ', () => {
        return request(app)
            .get(`/api/articles/6/comments`)
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([{
                    comment_id: 16,
                    body: 'This is a bad article name',
                    article_id: 6,
                    author: 'butter_bridge',
                    votes: 1,
                    created_at: '2020-10-11T15:23:00.000Z'
                }]);
            });
    });
    test('404: returns an error message when passed an article id that is of the correct type but does not exist in the database', () => {
        return request(app)
            .get(`/api/articles/66666/comments`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('This article doesn\'t exist, or it doesn\'t have comments.')
            })
    });
    test('404: returns an error message when passed an article id that is of the correct but there are no comments in the database', () => {
        return request(app)
            .get(`/api/articles/2/comments`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('This article doesn\'t exist, or it doesn\'t have comments.')
            })
    });
});

describe('Task 10: POST /api/articles/:article_id/comments', () => {
    test('201: returns a posted comment', () => {
        const newComment = {
            username: "icellusedkars",
            body: "A quien madruga, Dios le ayuda!",
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.addedComment).toEqual({
                    comment_id: 19,
                    body: "A quien madruga, Dios le ayuda!",
                    article_id: 3,
                    author: "icellusedkars",
                    votes: 0,
                    created_at: expect.any(String)
                });
            });
    });
    test('400: if comment is missing username or comment text', () => {
        const newComment = { body: "A quien madruga, Dios le ayuda!" };

        return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment is missing username or comment text!')
            })
    });
});

describe('Task 11: GET /api/articles with sort_by and order_by', () => {
    test("200 returns articles sorted by author", () => {
        return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("author", {
                    descending: true,
                });
            });
    });
    test("200 returns articles sorted by comment_counts", () => {
        return request(app)
            .get("/api/articles?sort_by=comment_count")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("comment_count", {
                    descending: true,
                });
            });
    });
    test("200 returns articles sorted by comment_counts in ascending ", () => {
        return request(app)
            .get("/api/articles?sort_by=comment_count&order=asc")
            .expect(200)
            .then(({ body }) => {
                console.log(body);
                expect(body.articles).toBeSortedBy("comment_count", {
                    descending: false,
                });
            });
    });
    
});