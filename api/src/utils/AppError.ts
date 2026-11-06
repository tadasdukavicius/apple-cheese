/** Machine-readable error codes. Messages are Lithuanian because they are shown to shoppers. */
export type ErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_FAILED'
  | 'UNAUTHORIZED'
  | 'INVALID_TOKEN'
  | 'NOT_FOUND'
  | 'INVALID_ID'
  | 'REFERENCE_NOT_FOUND'
  | 'CART_EMPTY'
  | 'ORDER_NOT_PAYABLE'
  | 'PAYMENT_FAILED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(code: ErrorCode, message: string, details?: unknown) {
    return new AppError(400, code, message, details);
  }

  static unauthorized(code: ErrorCode = 'UNAUTHORIZED', message = 'Reikia prisijungti') {
    return new AppError(401, code, message);
  }

  static notFound(message = 'Nerasta') {
    return new AppError(404, 'NOT_FOUND', message);
  }
}
