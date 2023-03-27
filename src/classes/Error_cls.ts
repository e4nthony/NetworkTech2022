class Error_cls {
    status_code = 0;
    message = null;

    constructor(status_code, message, error = null) {
        this.status_code = status_code;
        this.message = message;
    }
}
module.exports = Error_cls