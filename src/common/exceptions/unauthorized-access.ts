import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';
import { CustomHttpException } from './custom-http-exception';

export class UnauthorizedAccessError extends CustomHttpException {
  constructor() {
    super(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
  }
}
