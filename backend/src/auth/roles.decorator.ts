import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  NGO_ADMIN = 'NGO_ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  VOLUNTEER = 'VOLUNTEER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);