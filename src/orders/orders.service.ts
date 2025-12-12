import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-items.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Item } from '../items/items.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const items: OrderItem[] = [];

    let total = 0;

    for (const i of dto.items) {
      const item = await this.itemRepo.findOne({ where: { id: i.itemId } });

      if (!item) {
        throw new NotFoundException(`Item ID ${i.itemId} não encontrado`);
      }

      const subtotal = Number(i.unitPrice) * i.quantity;
      total += subtotal;

      items.push(
        this.orderItemRepo.create({
          itemId: i.itemId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal,
        }),
      );
    }

    const order = this.orderRepo.create({
      customerId: dto.customerId,
      total,
      items,
    });

    return this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find({
      relations: ['customer', 'items', 'items.item'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.item'],
    });

    if (!order) throw new NotFoundException('Pedido não encontrado.');

    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Pedido não encontrado');

    // 1️⃣ Remover todos os order_items antigos
    await this.orderItemRepo.delete({ orderId: id });

    let total = 0;
    const newItems: OrderItem[] = [];

    // 2️⃣ Adicionar itens novos (sempre com orderId)
    if (dto.items) {
      for (const i of dto.items) {
        const item = await this.itemRepo.findOne({ where: { id: i.itemId } });

        if (!item) {
          throw new NotFoundException(`Item ID ${i.itemId} não encontrado`);
        }

        const subtotal = Number(i.unitPrice) * i.quantity;
        total += subtotal;

        newItems.push(
          this.orderItemRepo.create({
            orderId: id,
            itemId: i.itemId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            subtotal,
          }),
        );
      }

      order.items = newItems;
    }

    // 3️⃣ Atualizar campos simples
    if (dto.customerId) order.customerId = dto.customerId;
    order.total = total;

    return this.orderRepo.save(order);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
    return { deleted: true };
  }
}
