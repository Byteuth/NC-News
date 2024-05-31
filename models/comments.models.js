const db = require("../db/connection")
const { 
    rejectInvalidCommentId,
} = require("../error_handlers/error_handlers");

exports.getCommentById = (commentId) => {
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`, 
        [commentId]
    )
    .then(result => {
        const resultCount = result.rowCount
        if (resultCount === 0) {
            return rejectInvalidCommentId()
        }     
        return ''
    })
    
}

