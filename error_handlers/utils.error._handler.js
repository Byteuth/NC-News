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


