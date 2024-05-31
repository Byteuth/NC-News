const {
    getCommentById
} = require('../models/comments.models')


exports.deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id
    getCommentById(commentId)
    .then((deletedComment) => {
        res.status(204).send({deletedComment: deletedComment});
    })
    .catch(next)
}

