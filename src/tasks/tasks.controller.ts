import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, FilterTasksDto, UpdateTaskStatusDto } from './dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  filterTasks(@Query() filterTasksDto: FilterTasksDto): Promise<Task[]> {
    return this.tasksService.filterTasks(filterTasksDto);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
