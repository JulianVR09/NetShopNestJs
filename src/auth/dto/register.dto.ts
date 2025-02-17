import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsNumber()
  age: number;

  @IsString()
  @MinLength(10)
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
