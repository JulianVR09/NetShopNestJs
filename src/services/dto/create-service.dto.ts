import { IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  studies: string;

  @IsString()
  HV: string;
}
