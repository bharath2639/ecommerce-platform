// apps/order-service/src/order/entities/order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // From Auth Service

  @Column()
  productId: string; // From Product Service

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @Column({ default: 'PENDING' }) // PENDING -> CONFIRMED -> CANCELLED
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}