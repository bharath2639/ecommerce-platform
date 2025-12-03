import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { ProductModule } from '../product/product.module';
import { CacheModule } from '@nestjs/cache-manager'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 1. Load Environment Variables
    
    // 2. Configure Cache (In-Memory)
    CacheModule.register({ isGlobal: true, ttl: 10000, max: 100 }),

    // 3. Configure Database using process.env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres', // 👈 VITAL CHANGE: Uses 'postgres' in Docker
      port: 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'bharath123',
      database: process.env.DB_DATABASE || 'ecommerce_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}