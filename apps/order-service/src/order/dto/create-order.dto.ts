export class CreateOrderDto {
  userId: string;
  productId: string;
  quantity: number;
  price: number; // We'll trust the client for now (later we fetch from Product Service)
}