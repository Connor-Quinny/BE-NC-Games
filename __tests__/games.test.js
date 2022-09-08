const app = require("../app.js")
const request = require("supertest")
const testData = require("../db/data/test-data")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")

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
        it("400: should respond with an error message when the wrong endpoint is called", () => {
            return request(app)
            .get("/api/categori3s/")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("not found")
            })
        })
    })
})

describe("GET /api/reviews/:review_id", () => {
    it('200: should respond with an object of the correct review', () => {
        return request(app)
        .get(`/api/reviews/3`)
        .expect(200)
        .then(({body}) => {
            expect(typeof body.review).toBe('object')
            expect(body.review).toMatchObject( {
                title: 'Ultimate Werewolf',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: "We couldn't find the werewolf!",
                category: 'social deduction',
                created_at: expect.any(String),
                votes: 5
              })
        })
    });
    it('404: should respond with "not found" when an invalid id is passed', () => {
        return request(app)
        .get("/api/reviews/100000")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("not found")
        })
    });
    it('400: should respond with "bad request" when a wrong request is passed ', () => {
        return request(app)
        .get("/api/reviews/hello")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    });
})

describe("GET: /api/users", () => {
    it("200: should respond with an array of objects with the correct keys", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            console.log(body)
            expect(Array.isArray(body.users)).toBe(true)
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    });
    it("404: should respond with not found when passed an incorrect path", () => {
        return request(app)
        .get("/api/us3rs")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("not found")
        })
    })
})

describe("PATCH: /api/reviews/:review_id", () => {
    it('200: should respond with an updated review with the correct vote count', () => {
        return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({body}) => {
            expect(typeof body.review).toBe("object")
            expect(body.review).toMatchObject({
                title: 'Ultimate Werewolf',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: "We couldn't find the werewolf!",
                category: 'social deduction',
                created_at: expect.any(String),
                votes: 15
            })
        })
    });
    it("404: should respond with not found when passed an invalid id", () => {
        return request(app)
        .patch("/api/reviews/1000000")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("not found")
        })
    })
    it("400: should respond with bad request when an invalid request is passed", () => {
        return request(app)
        .patch("/api/reviews/three")
        .send({ inc_votes: 10})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    })
    it("should respond with bad request when an invalid vote count is passed", () => {
        return request(app)
        .patch("/api/reviews/3")
        .send({inc_votes: "hi"})
        .expect(400)
        .then(({body}) => {
            console.log(body)
            expect(body.msg).toBe("bad request")
        })
    })
    it("should respond with bad request when passed an empty object", () => {
        return request(app)
        .patch("/api/reviews/3")
        .send({})
        .expect(400)
        .then(({body}) => {
            console.log(body, "body>>>")
            expect(body.msg).toBe("bad request")
        })
    })
    it("should respond bad request when the key is wrong when passed", () => {
        return request(app)
        .patch("/api/reviews/3")
        .send({votes: 5})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    })
})