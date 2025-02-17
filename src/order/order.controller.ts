import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/activeUser.interface';

import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @ActiveUser() user: ActiveUserInterface
  ): Promise<Order> {
    return this.orderService.createOrder(createOrderDto, user);
  }

  @Get()
  async getOrder(): Promise<Order[]> {
    return this.orderService.findAllOrder();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOneOrder(id);
  }
}
