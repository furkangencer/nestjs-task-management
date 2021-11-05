import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { TaskNotFoundError } from '../common/exceptions';
import { CreateTaskDto, FilterTasksDto } from './dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  filterTasks(filterTasksDto: FilterTasksDto, user: User): Promise<Task[]> {
    return this.tasksRepository.filterTasks(filterTasksDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const foundTask = await this.tasksRepository.findOne({
      where: { id, user },
    });
    if (!foundTask) {
      throw new TaskNotFoundError();
    }
    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: string,
    user: User,
    status: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (!result.affected) {
      throw new TaskNotFoundError();
    }
  }
}
