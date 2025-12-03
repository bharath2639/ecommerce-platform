// apps/auth-service/src/auth/jwt.module.ts :

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: 'hardcoded-secret-key-123', // <--- HARDCODED MATCHING KEY
        signOptions: { expiresIn: '1h' },   // <--- INCREASED TO 1 HOUR
      }),
      inject: [],
    }),
  ],
  exports: [JwtModule],
})
export class CustomJwtModule {}