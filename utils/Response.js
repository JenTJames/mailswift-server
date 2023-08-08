module.exports = class Response {
  constructor(isSuccess, message, data = []) {
    this.isSuccess = isSuccess;
    this.message = message;
    this.data = data;
  }
};
