import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject('INVENTORY_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create({
      userId: createOrderDto.userId,
      productId: createOrderDto.productId,
      quantity: createOrderDto.quantity,
      // Calculate total price if you have the product price, 
      // otherwise this might need to come from the frontend or product service lookup
      totalPrice: createOrderDto.price * createOrderDto.quantity, 
      status: 'PENDING',
    });

    const savedOrder = await this.orderRepository.save(order);

    // 📢 EMIT THE EVENT
    this.rabbitClient.emit('order_created', {
      orderId: savedOrder.id,
      productId: savedOrder.productId,
      quantity: savedOrder.quantity,
    });

    return savedOrder;
  }

  findAll() {
    return this.orderRepository.find();
  }

  findOne(id: number) { return `This action returns a #${id} order`; }

  // ✅ FIXED: Changed orderId type from 'number' to 'any' to handle the UUID string safely
  async updateStatus(orderId: any, status: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (order) {
      order.status = status;
      await this.orderRepository.save(order);
      console.log(`Order #${orderId} status updated to: ${status}`);
    }
  }
}