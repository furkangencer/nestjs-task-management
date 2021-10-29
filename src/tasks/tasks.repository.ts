import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto, FilterTasksDto } from './dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);

    return task;
  }

  async filterTasks(
    filterTasksDto: FilterTasksDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterTasksDto;
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany().catch((error) => {
      this.logger.error(
        `Failed to get tasks for user "${user.username}": ${error.message}`,
      );
      throw new InternalServerErrorException();
    });

    return tasks;
  }
}
