import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './orders.entity';
import { OrderItem } from './order-items.entity';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { CustomersModule } from '../customers/customers.module';
import { ItemsModule } from '../items/items.module';
import { OrderItemsModule } from './order-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CustomersModule,
    ItemsModule,
    OrderItemsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
