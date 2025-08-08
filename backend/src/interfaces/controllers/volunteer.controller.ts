import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VolunteerService } from '../../application/services/volunteer.service.js';
import { OnboardVolunteerDto } from '../../application/dto/volunteer.dto.js';

@ApiTags('volunteers')
@Controller('volunteers')
export class VolunteerController {
  constructor(private readonly service: VolunteerService) {}

  @Post()
  async onboard(@Body() dto: OnboardVolunteerDto) {
    return this.service.onboard(dto);
  }

  @Get()
  async list(@Headers('x-tenant-id') tenantId: string) {
    return this.service.listForTenant(tenantId);
  }
}