const db = require("../db/connection")

exports.findTopics = () => {
    return db.query(
        `SELECT *
        FROM topics;`
    )
    .then((result) => {
        const topics = result.rows
        return topics
    })
}