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

  // Criar vários itens do pedido de uma vez
  async createMany(orderItems: Partial<OrderItem>[]) {
    const entities = this.orderItemsRepository.create(orderItems);
    return this.orderItemsRepository.save(entities);
  }

  // Criar um único item (não é usado normalmente, mas útil para reutilização)
  async create(data: Partial<OrderItem>) {
    const entity = this.orderItemsRepository.create(data);
    return this.orderItemsRepository.save(entity);
  }

  // Buscar itens de um pedido
  async findByOrderId(orderId: number) {
    return this.orderItemsRepository.find({
      where: { order: { id: orderId } },
      relations: ['item'], // para retornar nome, descrição, valor_unitário
    });
  }

  // Atualizar um item específico do pedido
  async update(id: number, data: Partial<OrderItem>) {
    await this.orderItemsRepository.update(id, data);
    return this.orderItemsRepository.findOne({ where: { id } });
  }

  // Remover item
  async remove(id: number) {
    return this.orderItemsRepository.delete(id);
  }

  // Remover todos os itens de um pedido (útil ao atualizar pedidos)
  async removeByOrder(orderId: number) {
    return this.orderItemsRepository.delete({ order: { id: orderId } });
  }
}
