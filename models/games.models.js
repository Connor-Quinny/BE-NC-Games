const db = require("../db/connection")

exports.selectCategories = () => {
    return db.query('SELECT slug, description FROM categories').then((categories) => {
        return categories.rows
    })
}

