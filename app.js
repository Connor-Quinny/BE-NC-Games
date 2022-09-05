const express = require("express")
const app = express()

app.get("/api/categories", getCategories)