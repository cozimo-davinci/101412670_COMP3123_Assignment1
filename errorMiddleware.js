const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const errObject = {
        status: 500,
        messagee: "Internal Server Error",
        err: err.message,
    }
    res.status(500).send(errObject);
    next();

}

module.exports = errorHandler;