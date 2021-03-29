const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    res.json(err)

    console.error(err)
    return
}

module.exports = errorHandler;
   