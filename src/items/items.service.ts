import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './items.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepo: Repository<Item>,
  ) {}

  async create(dto: CreateItemDto): Promise<Item> {
    const item = this.itemsRepo.create(dto);
    return this.itemsRepo.save(item);
  }

  async findAll(): Promise<Item[]> {
    return this.itemsRepo.find();
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item não encontrado.');
    return item;
  }

  async update(id: number, dto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);

    Object.assign(item, dto);

    return this.itemsRepo.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemsRepo.remove(item);
  }
}
