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
            expect(body.msg).toBe("bad request")
        })
    })
    it("should respond with bad request when passed an empty object", () => {
        return request(app)
        .patch("/api/reviews/3")
        .send({})
        .expect(400)
        .then(({body}) => {
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

describe("GET: /api/reviews/:review_id", () => {
    it("200: should respond with an object of review of correct id with a comment_count", () => {
        return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({body}) => {
            expect(typeof body.review).toBe("object")
            expect(body.review).toHaveProperty("comment_count", 3)
            expect(body.review).toMatchObject({
                    title: 'Ultimate Werewolf',
                    designer: 'Akihisa Okui',
                    owner: 'bainesface',
                    review_img_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: "We couldn't find the werewolf!",
                    category: 'social deduction',
                    created_at: expect.any(String),
                    votes: 5,
                    comment_count: 3
            })
        })
    })
    it("200: should respond with an object of the correct review with the comment count at 0", () => {
        return request(app)
        .get("/api/reviews/8")
        .expect(200)
        .then(({body}) => {
            expect(typeof body.review).toBe("object")
            expect(body.review).toHaveProperty("comment_count", 0)
            expect(body.review).toMatchObject({
                title: 'One Night Ultimate Werewolf',
                designer: 'Akihisa Okui',
                owner: 'mallionaire',
                review_img_url:
                  'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                review_body: "We couldn't find the werewolf!",
                category: 'social deduction',
                created_at: expect.any(String),
                votes: 5,
                comment_count: 0
            })
        })
    })
    it("404: should respond with not found when an invalid id is passed", () => {
        return request(app)
        .get("/api/reviews/100000")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("not found")
        })
    })
    it("400: should respond with bad request when an invalid request is passed", () => {
        return request(app)
        .get("/api/reviews/three")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("bad request")
        })
    })
})

describe("GET:/api/reviews & accepts queries", () => {
    it("should respond with an array of review objects with the correct category and comment count", () => {
        return request(app)
        .get("/api/reviews/?category=euro game")
        .expect(200)
        .then(({body}) => {
            const { reviews } = body
            expect(typeof reviews).toBe("object")
            expect(reviews).toHaveProperty("category", "euro game")
            expect(reviews).toHaveProperty("comment_count", 0)
            expect(reviews).toMatchObject({
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: expect.any(String),
                votes: 1,
                comment_count: 0
            })
        })
    })
    describe('error handling', () => {
        test('404: if category given is valid but does not exist', () => {
          return request(app)
            .get(`/api/reviews?category=fakenews`)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('There is no such category');
            });
        });
      });
    });

    describe.only('GET /api/reviews/:review_id/comments', () => {
        it('200: Returns array of comments for the given review id', () => {
          const reviewId = 2;
          return request(app)
            .get(`/api/reviews/${reviewId}/comments`)
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBe(3);
              expect(body.comments).toEqual([
                {
                  author: 'bainesface',
                  body: 'I loved this game too!',
                  comment_id: 1,
                  created_at: '2017-11-22T12:43:33.389Z',
                  review_id: 2,
                  votes: 16,
                },
                {
                  author: 'bainesface',
                  body: 'EPIC board game!',
                  comment_id: 4,
                  created_at: '2017-11-22T12:36:03.389Z',
                  review_id: 2,
                  votes: 16,
                },
                {
                  author: 'mallionaire',
                  body: 'Now this is a story all about how, board games turned my life upside down',
                  comment_id: 5,
                  created_at: '2021-01-18T10:24:05.410Z',
                  review_id: 2,
                  votes: 13,
                },
              ]);
            });
        });
        it(`404: Returns error if review_id doesn't exist`, () => {
            const reviewId = -1;
            return request(app)
              .get(`/api/reviews/${reviewId}/comments`)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toEqual(`The review id does not exist, or there are no comments for this review`);
              });
          });
    })