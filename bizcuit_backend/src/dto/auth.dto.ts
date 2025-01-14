import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'bizcuit_developer',
    description: 'Unique username for the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'bizcuit_password',
    description: 'Password for the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'bizcuit_developer',
    description: 'Username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'bizcuit_password',
    description: 'Password for the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
