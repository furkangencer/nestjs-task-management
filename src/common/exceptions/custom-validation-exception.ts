import { HttpStatus, ValidationError } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';
import { CustomHttpException } from './custom-http-exception';

export class CustomValidationException extends CustomHttpException {
  constructor(error: ValidationError) {
    super(
      {
        ...ERROR_MESSAGES.VALIDATION,
        constraints: error.constraints,
        property: error.property,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
