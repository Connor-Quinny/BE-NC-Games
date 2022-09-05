const db = require("../db/connection")

const selectCategories = () => {
    return db.query('SELECT slug, description FROM categories').then((results) => {
        return results.rows
    })
}

module.exports = selectCategories