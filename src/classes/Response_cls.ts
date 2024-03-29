class Response_cls {
    body = {};
    userId = null;
    err = null;

    constructor(body, userId, err: Error_cls = null) {
        this.body = body
        this.userId = userId
        this.err = err;
    }

    sendRestResponse(res) {
        if (this.err == null) {
            res.status(200).send({
                'status': 'ok',
                'post': this.body
            })
        } else {
            res.status(this.err.code).send({
                'status': 'fail',
                'message': this.err.message
            })
        }
    }
}

module.exports = Response_cls