import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  FilterTasksDto,
  UpdateTaskStatusDto,
  TaskIdDto,
} from './dto';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/decorators';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  filterTasks(
    @Query() filterTasksDto: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.filterTasks(filterTasksDto, user);
  }

  @Get(':id')
  getTaskById(
    @Param() { id }: TaskIdDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param() { id }: TaskIdDto,
    @GetUser() user: User,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, user, status);
  }

  @Delete(':id')
  deleteTask(@Param() { id }: TaskIdDto, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
