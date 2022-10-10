const request = require('supertest');

const app = require('../app');

const db = require("../db/connection");

const seed = require("../db/seeds/seed")

const data = require('../db/data/test-data');

beforeEach(() => seed(data));

afterAll(() => {
    if (db.end) db.end();
});

describe('1.1 GET api/topics', () => {
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


// test('respond with 400 if putting in an invalid column ', () => {
//     return request(app)
//         .get('/api/treasures?sort_by=colour')
//         .expect(400)
//         .then(({ body }) => {
//             expect(body.msg).toBe('Invalid sort value');
//         })
// });
// test('respond with 404 if endpoint does not exist', () => {
//     return request(app)
//         .get('/api/treasures/donkeys')
//         .expect(404)
//         .then(({ body }) => {
//             expect(body.msg).toBe('Route not found');
//         })
// });
// test('respond with 400 if order by value is invalid', () => {
//     return request(app)
//         .get('/api/treasures?order=up')
//         .expect(400)
//         .then(({ body }) => {
//             expect(body.msg).toBe('Invalid order value');
//         })
// });