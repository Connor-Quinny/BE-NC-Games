const { selectCategories } = require("../models/games.models.js")

const getCategories = (req, res, next) => {
    selectCategories().then((results) => {
        res.status(200).send({ results })
    }).catch(err)
}

module.exports = { getCategories }