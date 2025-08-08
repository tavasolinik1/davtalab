import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service.js';
import { CreateNgoDto } from '../dto/ngo.dto.js';

@Injectable()
export class NgoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNgoDto) {
    const ngo = await this.prisma.ngo.create({ data: { name: dto.name } });
    // For the NGO itself, tenant_id equals ngo.id
    await this.prisma.ngo.update({ where: { id: ngo.id }, data: { tenantId: ngo.id } });
    return ngo;
  }

  async list() {
    // Public list - no tenant context
    return this.prisma.ngo.findMany({ select: { id: true, name: true } });
  }
}