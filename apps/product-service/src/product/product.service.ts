// apps/product-service/src/product/product.service.ts

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
  }

  findAll() {
    return this.productRepository.find();
  }

  // Changed id: number -> id: string
  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  // Changed id: number -> id: string
  update(id: string, updateProductDto: UpdateProductDto) {
    // We pre-load the entity with the new data, then save
    return this.productRepository.save({
      id, 
      ...updateProductDto
    });
  }

  // Changed id: number -> id: string
  async remove(id: string) {
    await this.productRepository.delete(id);
    return { deleted: true };
  }


async decreaseStock(productId: string, quantity: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    
    if (product) {
      product.stock -= quantity;
      await this.productRepository.save(product);
      console.log(`📉 Stock updated for ${product.name}. New Stock: ${product.stock}`);
    } else {
      console.log(`⚠️ Product not found for ID: ${productId}`);
    }
  }

  // Add inside ProductService class

async validateStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (product && product.stock >= quantity) {
      // Stock is good, reduce it
      product.stock -= quantity;
      await this.productRepository.save(product);
      return true;
    } 
    
    // Stock is insufficient or product missing
    return false;
}


}