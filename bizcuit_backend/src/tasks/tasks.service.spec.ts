import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    jest.spyOn(taskService['logger'], 'error').mockImplementation(() => {});
    jest.spyOn(taskService['logger'], 'log').mockImplementation(() => {});
    jest.spyOn(taskService['logger'], 'debug').mockImplementation(() => {});
  });

  it('should create a new task', async () => {
    const mockUser: User = {
      id: 1,
      username: 'test_user@example.com',
      password: 'hashed_password',
      tasks: [],
    } as User;

    const taskData = {
      title: 'Test Task',
      description: 'Testing TaskService',
      category: 'Work',
      completed: false,
      dueDate: new Date(),
      sharedTask: true,
      sharedUser: 'developer_2',
    };

    const createdTask = {
      ...taskData,
      id: 1,
      user: mockUser,
    } as Task;

    jest.spyOn(taskRepository, 'create').mockReturnValue(createdTask);
    jest.spyOn(taskRepository, 'save').mockResolvedValue(createdTask);

    const result = await taskService.createTask(taskData, mockUser);

    expect(taskRepository.create).toHaveBeenCalledWith({
      ...taskData,
      user: mockUser,
    });
    expect(taskRepository.save).toHaveBeenCalledWith(createdTask);
    expect(result).toMatchObject(createdTask);
  });

  it('should fetch tasks by user ID', async () => {
    const mockUser: User = {
      id: 1,
      username: 'test_user@example.com',
      password: 'hashed_password',
      tasks: [],
    } as User;

    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Task description 1',
        category: 'Work',
        completed: false,
        sharedTask: true,
        sharedUser: '2',
        dueDate: new Date(),
        user: mockUser,
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Task description 2',
        category: 'Family',
        completed: true,
        sharedTask: true,
        sharedUser: '2',
        dueDate: new Date(),
        user: mockUser,
      },
    ];

    jest.spyOn(taskRepository, 'find').mockResolvedValue(mockTasks);

    const result = await taskService.getTaskByUserId(mockUser.id);

    expect(taskRepository.find).toHaveBeenCalledWith({
      where: { user: { id: mockUser.id } },
      relations: ['user'],
    });
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Task 1');
  });

  it('should throw NotFoundException if no tasks are found for a user', async () => {
    jest.spyOn(taskRepository, 'find').mockResolvedValue([]);

    await expect(taskService.getTaskByUserId(1)).rejects.toThrow(
      NotFoundException,
    );
    expect(taskRepository.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      relations: ['user'],
    });
  });

  it('should delete a task', async () => {
    const mockUser: User = {
      id: 1,
      username: 'test_user@example.com',
      password: 'hashed_password',
      tasks: [],
    } as User;

    const mockTask: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Task description',
      category: 'Leisure',
      sharedTask: true,
      sharedUser: '2',
      completed: false,
      dueDate: new Date(),
      user: mockUser,
    };

    jest.spyOn(taskService, 'getTaskById').mockResolvedValue(mockTask);
    jest.spyOn(taskRepository, 'remove').mockResolvedValue(mockTask);

    const result = await taskService.deleteTask(mockTask.id, mockUser);

    expect(taskService.getTaskById).toHaveBeenCalledWith(mockTask.id, mockUser);
    expect(taskRepository.remove).toHaveBeenCalledWith(mockTask);
    expect(result).toEqual({
      message: `Task with ID ${mockTask.id} was deleted`,
    });
  });

  it('should throw NotFoundException when trying to delete a nonexistent task', async () => {
    const mockUser: User = {
      id: 1,
      username: 'test_user@example.com',
      password: 'hashed_password',
      tasks: [],
    } as User;

    jest
      .spyOn(taskService, 'getTaskById')
      .mockRejectedValue(new NotFoundException(`Task with ID 1 not found`));

    await expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
