import { Controller, Post, Body, Get } from '@nestjs/common'; // Standard imports
import { EventPattern, Payload } from '@nestjs/microservices'; // Microservice imports
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  // ✅ LISTENER: CONFIRM ORDER
  @EventPattern('order_confirmed')
  handleOrderConfirmed(@Payload() data: any) {
    console.log('✅ Order Confirmed Event:', data);
    this.orderService.updateStatus(data.orderId, 'CONFIRMED');
  }

  // ❌ LISTENER: CANCEL ORDER
  @EventPattern('order_cancelled')
  handleOrderCancelled(@Payload() data: any) {
    console.log('❌ Order Cancelled Event:', data);
    this.orderService.updateStatus(data.orderId, 'CANCELLED');
  }
}