import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Buy fruits and vegetables from the market',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The category/classification of the task',
    example: 'Drugstore',
  })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The due date for the task',
    example: '2024-12-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    description: 'Whether the task is shared with another user',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sharedTask?: boolean;

  @ApiProperty({
    description: 'User also responsible/accountable for this task',
    example: 'developer_2',
    required: false,
  })
  @IsOptional()
  @IsString()
  sharedUser?: string;

  @ApiProperty({
    description: 'Whether the task is completed',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
