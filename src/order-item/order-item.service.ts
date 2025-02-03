import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>
  ) {}

  async createOrderItem(order: Order, product: Product, quantity: number): Promise<OrderItem>{
    const orderItem = this.orderItemRepository.create({
      order,
      product,
      quantity,
      totalPrice: product.price,
    });

    return this.orderItemRepository.save(orderItem);
  }

  async findOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      where: { order: { id: orderId }},
      relations: ['product']
    })
  }

  async findOrderItemByOrderIdAndProductId(orderId: string, productId: string): Promise<OrderItem> {
    return this.orderItemRepository.findOne({
      where: { order: { id: orderId }, product: { id: productId } }
    });
  }

  async deleteOrderItem(id: string): Promise<void> {
    await this.orderItemRepository.delete(id);
  }
}
