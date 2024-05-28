exports.reject_404 = () => {
    return Promise.reject({
        status: 404,
        msg: `bad request`,
    });
    }
