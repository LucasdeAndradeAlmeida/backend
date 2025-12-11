import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepo.create(dto);
    return this.customersRepo.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customersRepo.find({
      relations: ['orders'],
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepo.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    Object.assign(customer, dto);

    return this.customersRepo.save(customer);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const customer = await this.findOne(id);
    await this.customersRepo.remove(customer);
    return { deleted: true };
  }
}
