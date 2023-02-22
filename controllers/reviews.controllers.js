const reviews = require("../db/data/test-data/reviews")
const { selectReviewById, patchVotesById, selectReviewsByQuery, selectReviewComments } = require("../models/reviews.models")

exports.getReviews = (req, res, next) => {
    const param = req.params
    selectReviewById(param.review_id).then((review) => {
        res.status(200).send({review})
    }).catch((err) => {
        next(err)
    })
};

exports.patchReviews = (req, res, next) => {
    const voteInc = req.body.inc_votes
    const id = req.params.review_id
    patchVotesById(voteInc, id).then((review) => {
        res.status(200).send({review})
    }).catch((err) => {
        next(err)
    })
};

exports.getReviewsByQuery = (req, res, next) => {
   const category = req.query.category
   selectReviewsByQuery(category).then((reviews) => {
    res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewsComments = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewComments(review_id)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch(next);
  };
