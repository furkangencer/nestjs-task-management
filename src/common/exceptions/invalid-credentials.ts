import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';

export class InvalidCredentialsError extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
  }
}
