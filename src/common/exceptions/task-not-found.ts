import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';
import { CustomHttpException } from './custom-http-exception';

export class TaskNotFoundError extends CustomHttpException {
  constructor() {
    super(ERROR_MESSAGES.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
