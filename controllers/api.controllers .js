const endPoints =  require('../endpoints.json')

exports.getAPI = (req, res, next) => {
        res.status(200).send({endpoints: endPoints})
}