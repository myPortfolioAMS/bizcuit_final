import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    this.logger.log(`Creating task for user ${user.id}`);
    try {
      const { dueDate, ...otherFields } = createTaskDto;

      const task = this.taskRepository.create({
        ...otherFields,
        dueDate: dueDate ? new Date(dueDate) : null,
        user,
      });

      this.logger.debug(`Task before save: ${JSON.stringify(task)}`);

      const savedTask = await this.taskRepository.save(task);
      this.logger.log(`Task created successfully: ${savedTask.id}`);
      return savedTask;
    } catch (error) {
      this.logger.error(
        `Failed to create task for user ${user.id}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAllTasks(): Promise<Task[]> {
    this.logger.log(`Fetching tasks for all users`);
    try {
      return await this.taskRepository.find();
    } catch (error) {
      this.logger.error(`Failed to fetch tasks for all users:`, error.stack);
      throw error;
    }
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    this.logger.log(`Fetching task with ID ${id} for user ${user.id}`);
    try {
      const task = await this.taskRepository.findOne({
        where: { id, user: { id: user.id } },
      });

      if (!task) {
        this.logger.warn(`Task with ID ${id} not found for user ${user.id}`);
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      this.logger.debug(`Task fetched successfully: ${JSON.stringify(task)}`);
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to fetch task with ID ${id} for user ${user.id}`,
        error.stack,
      );
      throw error;
    }
  }

  async getTaskByUserId(userId: number): Promise<Task[]> {
    this.logger.log(`Fetching all tasks created by user ${userId}`);
    try {
      const tasks = await this.taskRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (tasks.length === 0) {
        this.logger.warn(`No tasks found for user ${userId}`);
        throw new NotFoundException(`No tasks found for user ${userId}`);
      }

      this.logger.debug(`Task fetched successfully: ${JSON.stringify(tasks)}`);
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks created by the user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  async getSharedTasks(sharedUser: string): Promise<Task[]> {
    this.logger.log(`Fetching shared tasks ${sharedUser}`);
    try {
      return await this.taskRepository.find({
        where: { sharedUser },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch shared tasks ${sharedUser}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    this.logger.log(`Updating task ${id} for user ${user.id}`);
    try {
      const { dueDate, ...otherFields } = updateTaskDto;

      const task = await this.getTaskById(id, user);
      this.logger.debug(`Task before update: ${JSON.stringify(task)}`);

      Object.assign(task, {
        ...otherFields,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
      });

      this.logger.debug(`Task after applying updates: ${JSON.stringify(task)}`);

      const updatedTask = await this.taskRepository.save(task);
      this.logger.log(`Task ${id} updated successfully`);
      return updatedTask;
    } catch (error) {
      this.logger.error(
        `Failed to update task ${id} for user ${user.id}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteTask(id: number, user: User): Promise<{ message: string }> {
    this.logger.log(`Attempting to delete task ${id} for user ${user.id}`);
    try {
      const task = await this.getTaskById(id, user);

      if (!task) {
        this.logger.warn(`Task with ID ${id} not found for user ${user.id}`);
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      this.logger.debug(`Task found for deletion: ${JSON.stringify(task)}`);

      await this.taskRepository.remove(task);
      this.logger.log(`Task ${id} successfully deleted for user ${user.id}`);
      return { message: `Task with ID ${id} was deleted` };
    } catch (error) {
      this.logger.error(
        `Failed to delete task ${id} for user ${user.id}`,
        error.stack,
      );
      throw error;
    }
  }
}
