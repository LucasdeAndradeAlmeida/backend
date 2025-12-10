import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './order-items.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {}

  async createMany(orderItems: Partial<OrderItem>[]) {
    const entities = this.orderItemsRepository.create(orderItems);
    return this.orderItemsRepository.save(entities);
  }

  async create(data: Partial<OrderItem>) {
    const entity = this.orderItemsRepository.create(data);
    return this.orderItemsRepository.save(entity);
  }

  async findByOrderId(orderId: number) {
    return this.orderItemsRepository.find({
      where: { order: { id: orderId } },
      relations: ['item'],
    });
  }

  async update(id: number, data: Partial<OrderItem>) {
    await this.orderItemsRepository.update(id, data);
    return this.orderItemsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.orderItemsRepository.delete(id);
  }

  async removeByOrder(orderId: number) {
    return this.orderItemsRepository.delete({ order: { id: orderId } });
  }
}
