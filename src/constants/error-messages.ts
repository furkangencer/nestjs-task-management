export const ERROR_MESSAGES = {
  UNKNOWN: {
    error: 'UnknownError',
    message: 'Unknown error',
    code: -1,
  },
  VALIDATION: {
    error: 'ValidationError',
    message: 'Validation failed',
    code: -2,
  },
  INVALID_CREDENTIALS: {
    error: 'InvalidCredentialsError',
    message: 'Invalid credentials',
    code: 1,
  },
  USERNAME_ALREADY_EXISTS: {
    error: 'UsernameAlreadyExistsError',
    message: 'Username already exists',
    code: 2,
  },
  UNAUTHORIZED_ACCESS: {
    error: 'UnauthorizedAccessError',
    message: 'Unauthorized access',
    code: 3,
  },
  TASK_NOT_FOUND: {
    error: 'TaskNotFoundError',
    message: 'Task not found',
    code: 4,
  },
};
