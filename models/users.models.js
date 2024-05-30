const db = require("../db/connection")
const { 
    reject404,
    rejectInvalidCommentId,
} = require("../error_handlers/utils.error._handler");

exports.findUsers = () => {
    
    return db.query(
        `SELECT * 
        FROM users;`,
    )
    .then(result => {
        const users = result.rows
        return users
    })
    
}