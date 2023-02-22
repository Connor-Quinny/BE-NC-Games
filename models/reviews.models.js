const db = require("../db/connection")

exports.selectReviewById = (review_id) => {
    if (review_id) {
    return db.query('SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;', [review_id]).then((review) => {
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

exports.selectReviewsByQuery = (category) => {

  const queryValues = [];
  let queryStart =
    'SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id ';
  let queryEnd = 'GROUP BY reviews.review_id ORDER BY created_at DESC;';
  if (category === undefined) {
    return db.query(queryStart + queryEnd).then((result) => {
      return result.rows;
    });
  } else {
    queryValues.push(category);
    queryStart += `WHERE category = $1 `;
    return db.query(queryStart + queryEnd, queryValues).then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'There is no such category',
        });
      }
      return result.rows[0];
    });
  }
};

exports.selectReviewComments = (review_id) => {
    const queryString = 'SELECT * FROM comments WHERE review_id = $1';
    return db.query(queryString, [review_id]).then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'The review id does not exist, or there are no comments for this review',
        });
      }
      return result.rows;
    });
  };