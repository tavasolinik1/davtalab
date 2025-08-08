import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service.js';
import { OnboardVolunteerDto } from '../dto/volunteer.dto.js';
import { CryptoService } from '../../infrastructure/crypto/crypto.service.js';

@Injectable()
export class VolunteerService {
  constructor(private readonly prisma: PrismaService, private readonly crypto: CryptoService) {}

  async onboard(dto: OnboardVolunteerDto) {
    // No tenant set for public onboarding: membership insert sets tenant
    const volunteer = await this.prisma.volunteer.create({
      data: {
        fullNameEnc: this.crypto.encrypt(dto.fullName),
        emailEnc: this.crypto.encrypt(dto.email),
        phoneEnc: dto.phone ? this.crypto.encrypt(dto.phone) : null,
      },
    });

    await this.prisma.volunteerMembership.create({
      data: { volunteerId: volunteer.id, tenantId: dto.ngoId },
    });

    return { id: volunteer.id };
  }

  async listForTenant(tenantId: string) {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const volunteers = await (tx as any).volunteer.findMany({
        select: { id: true, fullNameEnc: true, emailEnc: true },
      });
      return volunteers.map((v: any) => ({
        id: v.id,
        fullName: this.crypto.decrypt(v.fullNameEnc),
        email: this.crypto.decrypt(v.emailEnc),
      }));
    });
  }
}