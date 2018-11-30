module.exports = class Error {
    constructor(id, message) {
    this.id = id;
    this.message = message;
}

getResponse() {
    return {
        'error': {
            'id': this.id,
            'message': this.message,
            'timestamp': (new Date().getTime())
        }
    }
}
};