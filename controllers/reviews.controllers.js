const { selectReviewById, patchVotesById } = require("../models/reviews.models")

exports.getReviews = (req, res, next) => {
    const param = req.params
    selectReviewById(param.review_id).then((review) => {
        res.status(200).send({review})
    }).catch((err) => {
        next(err)
    })
}

exports.patchReviews = (req, res, next) => {
    const voteInc = req.body.inc_votes
    const id = req.params.review_id
    patchVotesById(voteInc, id).then((review) => {
        res.status(200).send({review})
    }).catch((err) => {
        next(err)
    })
}