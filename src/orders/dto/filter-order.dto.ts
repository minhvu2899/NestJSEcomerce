import { IsNotEmpty } from 'class-validator';
import { OrderItem } from '../order-item.entity';
import { OrderStatus } from '../order-status.enum';
import { PaymentMethods } from '../payment-methods.enum';
import { User } from 'src/users/user.entity';

export class FilterOrderDto {
  _status?: number;
  _limit?: number;
  _page?: number;
}
