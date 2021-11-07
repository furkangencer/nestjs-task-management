import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';

export class UsernameAlreadyExistsError extends HttpException {
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
