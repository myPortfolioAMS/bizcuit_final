import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { Task } from './tasks.entity';
import { User } from '../users/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created.',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const user = req.user;
    return this.taskService.createTask(createTaskDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks from the database' })
  @ApiResponse({
    status: 200,
    description: 'All Tasks retrieved successfully.',
    type: [Task],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('userId/:userId')
  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user whose tasks are to be retrieved',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks related to the current user retrieved successfully.',
    type: [Task],
  })
  @ApiResponse({ status: 404, description: 'No tasks found for the user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getTaskByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.taskService.getTaskByUserId(userId);
  }

  @Get('shared/:sharedUser')
  @ApiOperation({ summary: 'Get a specific tasks by SharedTask' })
  @ApiParam({ name: 'sharedUser' })
  @ApiResponse({
    status: 200,
    description: 'Shared Tasks retrieved successfully.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSharedTasks(@Param('sharedUser') sharedUser: string) {
    return this.taskService.getSharedTasks(sharedUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({ name: 'id', description: 'ID of the task to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const user: User = {
      id: req.user.id,
      username: req.user.username,
      password: req.user.password,
      tasks: [],
    };
    return this.taskService.getTaskById(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'id', description: 'ID of the task to update' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.taskService.updateTask(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'ID of the task to delete' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteTask(@Param('id') id: number, @Request() req) {
    return this.taskService.deleteTask(id, req.user.userId);
  }
}
