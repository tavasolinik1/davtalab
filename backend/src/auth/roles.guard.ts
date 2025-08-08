import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from './roles.decorator.js';

const client = jwksClient({
  jwksUri: process.env.KEYCLOAK_JWKS_URL || '',
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string | undefined;

    // Allow public endpoints if no roles required
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');
    const token = authHeader.replace('Bearer ', '');

    const issuer = process.env.JWT_ISSUER;
    const audience = process.env.JWT_AUDIENCE;

    const decoded: any = await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey as any,
        { algorithms: ['RS256'], audience, issuer },
        (err, payload) => (err ? reject(err) : resolve(payload)),
      );
    });

    request.user = decoded as JwtPayload;

    // Keycloak realm roles
    const roles: string[] = decoded?.realm_access?.roles || [];
    const hasRole = requiredRoles.some((r) => roles.includes(r));
    if (!hasRole) throw new ForbiddenException('Insufficient role');

    return true;
  }
}