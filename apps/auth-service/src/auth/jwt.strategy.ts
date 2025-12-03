// apps/auth-service/src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hardcoded-secret-key-123', // <--- VERIFY THIS MATCHES EXACTLY
    });
    console.log('JwtStrategy Initialized'); // <--- DEBUG 1
  }

  async validate(payload: any) {
    console.log('Token Validated! Payload:', payload); // <--- DEBUG 2
    return { userId: payload.sub, email: payload.email };
  }
}