class Error_cls {
    status_code = 0;
    message = null;

    constructor(status_code: number, message: string) {
        this.status_code = status_code;
        this.message = message;
    }


}
module.exports = Error_cls