import { Test } from '@nestjs/testing';
import { TaskNotFoundError } from '../common/exceptions';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  filterTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'someUsername',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  title: 'Test task',
  description: 'Test desc',
  id: '1',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = await module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('filterTasks', () => {
    it('calls TasksRepository.filterTasks and returns all result', async () => {
      tasksRepository.filterTasks.mockResolvedValue('someValue');
      const result = await tasksService.filterTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and throws error', () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        TaskNotFoundError,
      );
    });
  });
});
