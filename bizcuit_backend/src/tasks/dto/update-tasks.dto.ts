import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The updated title of the task',
    example: 'Go shopping',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The updated description of the task',
    example: 'Buy clothes and electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The category/classification of the task',
    example: 'Drugstore',
  })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The updated due date for the task',
    example: '2024-12-05T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

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
    description: 'The updated completion status of the task',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
