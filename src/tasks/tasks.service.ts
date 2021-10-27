import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  filterTasks(filterTasksDto: FilterTasksDto): Promise<Task[]> {
    return this.tasksRepository.filterTasks(filterTasksDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.tasksRepository.findOne(id);
    if (!foundTask) {
      throw new NotFoundException(`Task with id '${id}' not found`);
    }
    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Task with id '${id}' not found`);
    }
  }
}
