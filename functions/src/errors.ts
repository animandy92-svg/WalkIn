import type { FunctionErrorCode } from '@walkin/shared';

export class DomainError extends Error {
  readonly code: FunctionErrorCode;

  constructor(code: FunctionErrorCode, message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}

export function notFound(message: string): never {
  throw new DomainError('NOT_FOUND', message);
}

export function invalidArgument(message: string): never {
  throw new DomainError('INVALID_ARGUMENT', message);
}

export function permissionDenied(message: string): never {
  throw new DomainError('PERMISSION_DENIED', message);
}
