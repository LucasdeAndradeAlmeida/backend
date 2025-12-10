import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers/customers.entity';
import { Item } from './items/items.entity';
import { Order } from './orders/orders.entity';
import { OrderItem } from './orders/order-items.entity';
import { CustomersModule } from './customers/customers.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './orders/order-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [Customer, Item, Order, OrderItem],
        synchronize: true, // use true só em dev; lembre-se de false em produção
        logging: false,
      }),
    }),
    CustomersModule,
    ItemsModule,
    OrdersModule,
    OrderItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
