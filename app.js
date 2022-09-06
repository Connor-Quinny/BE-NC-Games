const express = require("express")
const app = express()
const { getCategories} = require("./controllers/categories.controllers.js")
const {getReviews} = require("./controllers/reviews.controllers")

app.get("/api/categories", getCategories)

app.get("/api/reviews/:review_id", getReviews)

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