const express = require("express")
const app = express()
const { getCategories } = require("./controllers/games.controllers.js")

app.get("/api/categories", getCategories)

app.use((req, res, next) => {
   res.status(404).send({msg: "not found"})
})

module.exports = app