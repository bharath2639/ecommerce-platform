import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // <--- 1. Import ConfigModule
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <--- 2. Load Env Variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      // 👇 3. CHANGE THIS LINE to use Docker Host
      host: process.env.DB_HOST || 'postgres', 
      port: 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'bharath123',
      database: process.env.DB_DATABASE || 'ecommerce_db',
      autoLoadEntities: true,
      synchronize: true,

      // 👇 VITAL FIX FOR NEON DATABASE (RENDER) 👇
      // If we are NOT using 'postgres' (local docker), we assume we are in the cloud (Neon)
      // Neon requires SSL, but Docker local does not.
      ssl: process.env.DB_HOST !== 'postgres',
      extra: {
        ssl: process.env.DB_HOST !== 'postgres' ? { rejectUnauthorized: false } : null,
      },
    }),
    OrderModule,
  ],
})
export class AppModule {}