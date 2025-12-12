import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from '../customers/customers.entity';
import { OrderItem } from './order-items.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItem, (o) => o.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
