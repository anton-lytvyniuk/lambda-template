/* eslint-disable max-classes-per-file */

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}

class InternalError extends CustomError {
  constructor(message) {
    super(message, 500);
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

class UnprocessableError extends CustomError {
  constructor(message) {
    super(message, 422);
  }
}

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message, 403);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  InternalError,
  BadRequestError,
  UnprocessableError,
  ForbiddenError,
};
