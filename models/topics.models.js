const db = require("../db/connection")
const { 
    reject404 
} = require("../error_handlers/error_handlers");

exports.findTopics = () => {
    return db.query(
        `SELECT *
        FROM topics;`
    )
    .then((result) => {
        const topics = result.rows
        if (topics === '{}') return reject404()
        return topics
    })
}