import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';
import { CustomHttpException } from './custom-http-exception';

export class UsernameAlreadyExistsError extends CustomHttpException {
  constructor(data: Record<string, any>) {
    super(
      {
        ...ERROR_MESSAGES.USERNAME_ALREADY_EXISTS,
        data,
      },
      HttpStatus.CONFLICT,
    );
  }
}
