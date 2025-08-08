import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, UserRole } from '../../auth/roles.decorator.js';
import { CreateNgoDto } from '../../application/dto/ngo.dto.js';
import { NgoService } from '../../application/services/ngo.service.js';

@ApiTags('ngos')
@Controller('ngos')
export class NgoController {
  constructor(private readonly service: NgoService) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() dto: CreateNgoDto) {
    return this.service.create(dto);
  }
}