import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';

@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  async create(
    @Body() createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    const { orderId, productId, quantity } = createOrderItemDto;
    
    const order = new Order();
    order.id = orderId;

    const product = new Product();
    product.id = productId;

    return this.orderItemService.createOrderItem(order, product, quantity);
  }

  @Get('order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string): Promise<OrderItem[]> {
    return this.orderItemService.findOrderItemsByOrderId(orderId);
  }

  @Get('order/:orderId/product/:productId')
  async findByOrderIdAndProductId(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
  ): Promise<OrderItem> {
    return this.orderItemService.findOrderItemByOrderIdAndProductId(orderId, productId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.orderItemService.deleteOrderItem(id);
  }
}