import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants';

export class TaskNotFoundError extends HttpException {
  constructor() {
    super(ERROR_MESSAGES.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
