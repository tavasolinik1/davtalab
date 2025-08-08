import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class OnboardVolunteerDto {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  fullName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'NGO to join' })
  @IsUUID()
  ngoId!: string;
}

export class VolunteerResponseDto {
  id!: string;
  fullName!: string;
  email!: string;
}