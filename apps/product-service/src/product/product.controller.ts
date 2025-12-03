import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Inject, 
  UseInterceptors // <--- Import this
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager'; // <--- Import these
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EventPattern, Payload, ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('ORDER_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  // 📢 RABBITMQ HANDLER: Order Created
  @EventPattern('order_created') 
  async handleOrderCreated(@Payload() data: any) {
    console.log('⚡ EVENT RECEIVED: Order Created', data);
    
    // 1. Try to validate stock
    const isSuccess = await this.productService.validateStock(
      data.productId,
      data.quantity,
    );

    const eventPayload = {
      orderId: data.orderId,
      productId: data.productId,
    };

    // 2. Emit Success or Failure back to Order Service
    if (isSuccess) {
      console.log('✅ Stock Available. Emitting order_confirmed');
      this.rabbitClient.emit('order_confirmed', eventPayload);
    } else {
      console.log('❌ Out of Stock. Emitting order_cancelled');
      this.rabbitClient.emit('order_cancelled', eventPayload);
    }
  }

  // --- STANDARD CRUD ENDPOINTS ---

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // ⚡⚡⚡ CACHING IMPLEMENTED HERE ⚡⚡⚡
  @Get()
  @UseInterceptors(CacheInterceptor) // 1. Intercepts the request to check cache
  @CacheTTL(30000) // 2. (Optional) Force this specific route to cache for 30 seconds
  findAll() {
    console.log('🔍 Fetching from Database...'); // You will only see this log ONCE every 30s
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}