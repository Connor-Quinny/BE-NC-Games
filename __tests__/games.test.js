const app = require("../app.js")
const request = require("supertest")
const testData = require("../db/data/test-data")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const categories = require("../db/data/test-data/categories.js")

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe("GET", () => {
    describe("GET /api/categories", () => {
        it('200: should respond with an array of objects with a slug and description', () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body}) => {
                expect(body.categories.length > 0).toBe(true)
                expect(Array.isArray(body.categories)).toBe(true)
                body.categories.forEach((categories) => {
                    expect(categories).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        });
        it.only("400: should respond with an error message when the wrong endpoint is called", () => {
            return request(app)
            .get("/api/categori3s/")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found")
            })
        })
    })
})