const db = require("../db/connection")

exports.selectReviewById = (review_id) => {
    if (review_id > 0) { 
    return db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id]).then((review) => {
        if (review.rows.length === 0) {
            return Promise.reject({status: 404, msg: "not found"})
        }
        return review.rows[0]
    })}
    return Promise.reject({status: 400, msg: "bad request"})
}

exports.patchVotesById = (voteInc, id) => {
     
    return db.query("UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;", [voteInc, id]).then((review) => {
        if (review.rows.length === 0) {
            return Promise.reject({status: 404, msg: "not found"})
        }
        return review.rows[0]
   }) 
}