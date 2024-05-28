exports.error_handler = (err, req, res, next) => {
    //console.log('error msg: ',err)

    if (err.code === '23502') {
        res.status(400).send({ msg: 'Bad request' });
    } 
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request' });
    } 
    else if (err.status && err.msg) {
        res.status(404).send({ msg: "team does not exist" });
    }
    else {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}