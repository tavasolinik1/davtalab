import { Body, Controller, Get, Headers, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, UserRole } from '../../auth/roles.decorator.js';
import { CreateOpportunityDto } from '../../application/dto/opportunity.dto.js';
import { OpportunityService } from '../../application/services/opportunity.service.js';

@ApiTags('opportunities')
@Controller('opportunities')
export class OpportunityController {
  constructor(private readonly service: OpportunityService) {}

  @Get()
  async list(@Headers('x-tenant-id') tenantId: string) {
    return this.service.listForTenant(tenantId);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.NGO_ADMIN)
  async create(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateOpportunityDto) {
    return this.service.create(tenantId, dto);
  }

  @Post(':id/apply')
  @ApiBearerAuth()
  @Roles(UserRole.VOLUNTEER)
  async apply(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const volunteerId: string = req.user?.sub || 'anonymous';
    return this.service.apply(tenantId, id, volunteerId);
  }
}