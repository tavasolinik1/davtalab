import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateNgoDto {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  name!: string;
}

export class NgoResponseDto {
  id!: string;
  name!: string;
}