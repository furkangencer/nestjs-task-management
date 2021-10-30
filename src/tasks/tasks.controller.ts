import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  FilterTasksDto,
  UpdateTaskStatusDto,
  TaskIdDto,
} from './dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  filterTasks(
    @Query() filterTasksDto: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterTasksDto,
      )}`,
    );
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
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
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
