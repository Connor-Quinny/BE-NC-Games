const express = require("express")
const {getCategories} = require("./controllers/categories.controllers.js")
const {getReviews, patchReviews} = require("./controllers/reviews.controllers")
const {getUsers} = require("./controllers/users.controllers")

const app = express()
app.use(express.json())


app.get("/api/categories", getCategories)
app.get("/api/reviews/:review_id", getReviews)
app.get("/api/users", getUsers)
app.patch("/api/reviews/:review_id", patchReviews)


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send(err)
    } else {
        next(err)
    }
})


app.use((req, res, next) => {
   res.status(404).send({msg: "not found"})
})


module.exports = app