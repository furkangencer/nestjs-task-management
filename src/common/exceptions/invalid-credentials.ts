import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';
import { CustomHttpException } from './custom-http-exception';

export class InvalidCredentialsError extends CustomHttpException {
  constructor() {
    super(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
  }
}
