import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsNumber()
  age: number;

  @IsString()
  @MinLength(10)
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
