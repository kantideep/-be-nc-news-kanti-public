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
    test('status: 404 for endpoint not found', () => {
        return request(app)
            .get('/non_existent_endpoint')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Endpoint not found');
            });
    });
});

describe('Task 3: GET api/topics', () => {
    test('status:200, responds with an array of topic objects', () => {
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
    test('status:200, responds with a single matching article', () => {
        const ARTICLE_ID = 1;
        return request(app)
            .get(`/api/articles/${ARTICLE_ID}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    username: 'butter_bridge',
                    title: 'Living in the shadow of a great man',
                    article_id: ARTICLE_ID,
                    body: 'I find this existence challenging',
                    topic: 'mitch',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100
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

    describe('Task 5: GET /api/users', () => {
        test('200, responds with an array of topic objects ', () => {
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
});