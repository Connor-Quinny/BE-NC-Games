const { selectReviewById } = require("../models/reviews.models")

exports.getReviews = (req, res, next) => {
    const param = req.params
   // console.log(param.review_id)
    selectReviewById(param.review_id).then((review) => {
        res.status(200).send({review})
    }).catch((err) => {
        next(err)
    })
}