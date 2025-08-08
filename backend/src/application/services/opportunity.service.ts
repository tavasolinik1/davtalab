import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service.js';
import { CreateOpportunityDto } from '../dto/opportunity.dto.js';

@Injectable()
export class OpportunityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateOpportunityDto) {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const opp = await (tx as any).opportunity.create({
        data: { title: dto.title, description: dto.description, tenantId },
      });
      return opp;
    });
  }

  async apply(tenantId: string, opportunityId: string, volunteerId: string) {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const opp = await (tx as any).opportunity.findFirst({ where: { id: opportunityId } });
      if (!opp) throw new NotFoundException('Opportunity not found');
      const app = await (tx as any).application.create({
        data: { opportunityId, volunteerId, tenantId },
      });
      return app;
    });
  }

  async listForTenant(tenantId: string) {
    return this.prisma.withTenant(tenantId, async (tx) => {
      return (tx as any).opportunity.findMany({ select: { id: true, title: true, description: true } });
    });
  }
}