import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID } from 'class-validator';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsString()
  @Length(2, 200)
  title!: string;

  @ApiProperty()
  @IsString()
  @Length(0, 1000)
  description!: string;
}

export class ApplyOpportunityDto {
  @ApiProperty()
  @IsUUID()
  opportunityId!: string;
}

export class OpportunityResponseDto {
  id!: string;
  title!: string;
  description!: string;
}