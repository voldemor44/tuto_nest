import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret =
      config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET is not defined in environment variables',
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  // Redefinition d'une méthode abstraite de la classe mère PassportStrategy
  async validate(payload: any) {
    const user =
      await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    const { hash: _, ...userWithoutHash } = user;

    return userWithoutHash;
  }
}
