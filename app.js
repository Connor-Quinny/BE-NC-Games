const express = require("express")
const {getCategories} = require("./controllers/categories.controllers.js")
const {getReviews, patchReviews, getReviewsByQuery} = require("./controllers/reviews.controllers")
const {getUsers} = require("./controllers/users.controllers")

const app = express()
app.use(express.json())


app.get("/api/categories", getCategories)
app.get("/api/reviews/:review_id", getReviews)
app.get("/api/users", getUsers)
app.patch("/api/reviews/:review_id", patchReviews)
app.get("/api/reviews/", getReviewsByQuery)


app.all("/*", (req, res, next) => {
   res.status(404).send({msg: "not found"})
})

app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({ msg: "bad request"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send(err)
    } else {
        next(err)
    }
})





module.exports = app