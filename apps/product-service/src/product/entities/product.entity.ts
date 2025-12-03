// apps/product-service/src/product/entities/product.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 }) // stores prices like 99.99
  price: number;

  @Column()
  stock: number; 

  @Column({ default: true })
  isAvailable: boolean;
}