import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module.js';
import { MetricsModule } from './metrics/metrics.module.js';
import { NgoController } from './interfaces/controllers/ngo.controller.js';
import { VolunteerController } from './interfaces/controllers/volunteer.controller.js';
import { OpportunityController } from './interfaces/controllers/opportunity.controller.js';
import { NgoService } from './application/services/ngo.service.js';
import { VolunteerService } from './application/services/volunteer.service.js';
import { OpportunityService } from './application/services/opportunity.service.js';
import { CryptoService } from './infrastructure/crypto/crypto.service.js';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard.js';
import { TenantMiddleware } from './infrastructure/tenant/tenant.middleware.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, MetricsModule],
  controllers: [NgoController, VolunteerController, OpportunityController],
  providers: [NgoService, VolunteerService, OpportunityService, CryptoService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}