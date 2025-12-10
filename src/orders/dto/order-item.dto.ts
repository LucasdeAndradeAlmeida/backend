import { IsInt, IsNumber, Min } from 'class-validator';

export class OrderItemDto {
  @IsInt()
  itemId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}
