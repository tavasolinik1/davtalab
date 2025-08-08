import { Controller, Get, Header, Module } from '@nestjs/common';
import client from 'prom-client';

const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

@Controller('metrics')
class MetricsController {
  @Get()
  @Header('Content-Type', registry.contentType)
  async getMetrics() {
    return registry.metrics();
  }
}

@Module({ controllers: [MetricsController] })
export class MetricsModule {}