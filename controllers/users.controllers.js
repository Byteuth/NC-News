const {
    findUsers
} = require('../models/users.models')


exports.getUsers = (req, res, next) => {
    findUsers()
    .then((users) => {
        res.status(200).send({users: users})
    })
    .catch(next)
}

