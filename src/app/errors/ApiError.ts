class ApiError extends Error {
  statusCode: number;

  constructor(message: string | undefined, statusCode: number, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    }
    // Maintains proper stack trace (only in V8 engines like Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
  }
}

export default ApiError;
