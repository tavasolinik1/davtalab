import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async withTenant<T>(tenantId: string, callback: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(async (tx) => {
      await tx.$executeRawUnsafe("SELECT set_config('app.tenant_id', $1, true)", tenantId);
      return callback(tx as unknown as PrismaClient);
    });
  }

  async setTenantIdForSession(_tenantId: string): Promise<void> {
    // Deprecated in favor of withTenant wrapper to guarantee connection affinity per transaction
    return;
  }
}