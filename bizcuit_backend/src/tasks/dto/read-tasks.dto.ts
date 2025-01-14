import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the task',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete Swagger Integration',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Add Swagger decorators to all DTOs and controllers',
  })
  description: string;

  @ApiProperty({
    description: 'The category/classification of the task',
    example: 'Drugstore',
  })
  category: string;

  @ApiProperty({
    description: 'The due date for the task',
    example: '2024-12-01T00:00:00.000Z',
  })
  dueDate: string;

  @ApiProperty({
    description: 'Whether the task is shared with another user',
    example: false,
    required: false,
  })
  sharedTask?: boolean;

  @ApiProperty({
    description: 'User also responsible/accountable for this task',
    example: 'developer_2',
    required: false,
  })
  sharedUser?: string;

  @ApiProperty({
    description: 'The completion status of the task',
    example: false,
  })
  completed: boolean;

  @ApiProperty({
    description: 'The date and time when the task was created',
    example: '2024-11-28T09:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The date and time when the task was last updated',
    example: '2024-11-28T12:00:00.000Z',
  })
  updatedAt: string;
}
