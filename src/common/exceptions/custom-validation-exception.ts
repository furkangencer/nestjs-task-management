import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';

export class CustomValidationException extends HttpException {
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
