exports.reject404 = () => {
    return Promise.reject({
        status: 404,
        msg: 'Bad Request',
    });
    }
