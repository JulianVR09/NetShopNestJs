import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserInterface } from 'src/common/interface/activeUser.interface';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { OrderItemService } from 'src/order-item/order-item.service';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly orderItemService: OrderItemService,
    private readonly productService: ProductsService
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: ActiveUserInterface
  ): Promise<Order> {
    const order = this.orderRepository.create({
      user,
      ...createOrderDto,
    });

    await this.orderRepository.save(order);
    return order;
  }

  async findAllOrder(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items'],
    });
  }

  async findOneOrder(id: string): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async addProductToOrder(
    orderId: string,
    productId: string,
    quantity: number
  ): Promise<OrderItem> {
    const order = await this.findOneOrder(orderId);
    const product = await this.productService.findProductById(productId);

    return this.orderItemService.createOrderItem(order, product, quantity);
  }

  async removeProductFromOrder(
    orderId: string,
    productId: string
  ): Promise<void> {
    const orderItem =
      await this.orderItemService.findOrderItemByOrderIdAndProductId(
        orderId,
        productId
      );

    if (!orderItem) {
      throw new NotFoundException(
        `Order item with product id ${productId} not found for order id ${orderId}`
      );
    }

    await this.orderItemService.deleteOrderItem(orderItem[0]);
  }
}
