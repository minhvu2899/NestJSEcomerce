import { IsNotEmpty } from 'class-validator';
import { OrderItem } from '../order-item.entity';
import { OrderStatus } from '../order-status.enum';
import { PaymentMethods } from '../payment-methods.enum';
import { User } from 'src/users/user.entity';

export class CreateOrderDto {
  full_name: string;
  email: string;
  phone_number: string;
  shipping_address: string;
  payment_method: PaymentMethods;
  order_items: OrderItem[];
  user: User;
  total: number;
  product_cost: number;
  feeship: number;
  coupon_value?: number;
  coupon_code?: string;
}
