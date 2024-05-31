exports.resolvePSQLerrors = (err, req, res, next) => {
    //console.log('error msg: ',err)

    
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid Request' });
    } 
    if (err.code === '23502') {
        res.status(400).send({ msg: 'Bad Request' });
    } 
    if (err.code === '23503') {
        res.status(400).send({ msg: 'Bad Request' });
    }
    else if (err.status && err.msg) {
        res.status(404).send({ msg: err.msg});
    }
    else {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

exports.reject404 = () => {
    return Promise.reject({
        status: 404,
        msg: 'Bad Request',
    });
}

exports.rejectInvalidCommentId = () => {
    return Promise.reject({
        status: 404,
        msg: 'Bad Comment Id',
    });
}

exports.rejectInvalidQuery = () => {
    return Promise.reject({
        status: 404,
        msg: 'Invalid Query',
    });
}
