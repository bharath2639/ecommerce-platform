import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module'; // ✅ Try this (Directly in src)
import { ProductService } from './product/product.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  // Initialize the app context (but don't listen on a port)
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);

  console.log('🚀 Starting Seed for 1,000 Products...');
  
  const products = [];

  // Generate 1000 Fake Products
  for (let i = 0; i < 1000; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      stock: faker.number.int({ min: 0, max: 100 }), // Random stock 0-100
    });
  }

  // Insert them (batching would be better for 10k, but loop is fine for 1k)
  for (const product of products) {
    await productService.create(product as any);
  }

  console.log('✅ Seeding Complete! 1,000 products added.');
  await app.close();
}

bootstrap();