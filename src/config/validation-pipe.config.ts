import { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { CustomValidationException } from '../common/exceptions';

export const validationPipeConfig: ValidationPipeOptions = {
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    errors.map((e) => {
      throw new CustomValidationException(e);
    });
  },
};
